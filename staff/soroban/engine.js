/*
 * 楽珠そろばん 実演エンジン
 * 講師マニュアル（見取り算編・掛け算編・割り算編）の手順を、AIを使わずルールだけで再現する。
 * DOMに依存しない純粋なロジック。ブラウザでは window.Soroban、Nodeでは module.exports として使う。
 *
 * 珠の状態は digits[0..12]（0 = 一番右の竿）。各要素は 0〜9（5珠=5、下珠=0〜4）。
 * 実演は steps の配列で返す。各ステップ = セリフ・珠の状態・左手の位置など。
 */
(function (root) {
  'use strict';

  var NR = 13;
  var PLACE = ['一', '十', '百', '千', '万', '十万', '百万', '千万', '億', '十億', '百億', '千億', '兆'];

  // ---------- 共通ユーティリティ ----------

  function toDigits(v) {
    var s = String(v);
    if (s.length > NR) throw new Error('珠が足りません（桁数が大きすぎます）');
    s = new Array(NR - s.length + 1).join('0') + s;
    var a = new Array(NR);
    for (var r = 0; r < NR; r++) a[r] = +s.charAt(NR - 1 - r);
    return a;
  }

  function fromDigits(a) {
    var v = 0;
    for (var r = NR - 1; r >= 0; r--) v = v * 10 + a[r];
    return v;
  }

  function pow10(n) { return Math.pow(10, n); }

  function digitsOfInt(n) { return String(n).split('').map(Number); }

  // 読み上げ用に記号をひらがなへ
  function speak(t) {
    return t
      .replace(/×/g, 'かける')
      .replace(/÷/g, 'わる')
      .replace(/=/g, 'は')
      .replace(/・/g, '、')
      .replace(/\+/g, 'たす')
      .replace(/−/g, 'ひく');
  }

  // 1つの珠の動きから運指ヒントを作る（マニュアル2-4の運指ルール）
  function opHint(d0, d1) {
    var u0 = d0 >= 5, u1 = d1 >= 5, l0 = d0 % 5, l1 = d1 % 5;
    if (u0 === u1) return l1 > l0 ? '親指でいれます' : '人差し指でとります';
    if (l0 === l1) return u1 ? '人差し指で5をいれます' : '人差し指で5をとります';
    if (u1 && l1 > l0) return '親指と人差し指で挟むようにいれます';
    if (!u1 && l1 < l0) return '人差し指で下の珠、つづけて5をとります';
    return '';
  }

  function Ctx(P, kind) {
    this.P = P;            // 一の位（定位点）の竿の番号
    this.kind = kind;
    this.dg = new Array(NR).fill(0);
    this.prev = this.dg.slice();
    this.steps = [];
    this.finger = null;    // 左手の竿
    this.qFrom = null;     // わり算：この竿以上は「商」ゾーン
    this.pre = '';         // 次のステップのセリフの頭に付ける文
    this.multi = false;    // 見取り算：複数桁の数を処理中か
  }

  Ctx.prototype.push = function (text, o) {
    o = o || {};
    if (this.pre) { text = this.pre + text; this.pre = ''; }
    var changed = [];
    for (var r = 0; r < NR; r++) if (this.dg[r] !== this.prev[r]) changed.push(r);
    var hi = (o.hi || []).concat(changed).filter(function (x, i, a) { return a.indexOf(x) === i; });
    var hint = o.hint || '';
    if (!hint && changed.length === 1 && this.kind === 'mitori') hint = opHint(this.prev[changed[0]], this.dg[changed[0]]);
    this.steps.push({
      text: text,
      say: speak(text),
      point: o.point || '',
      hint: hint,
      digits: this.dg.slice(),
      hi: hi,
      finger: this.finger,
      qFrom: this.qFrom,
      val: o.val
    });
    this.prev = this.dg.slice();
  };

  Ctx.prototype.settle = function (val) {
    if (this.steps.length) this.steps[this.steps.length - 1].val = val;
  };

  function phr(c, r) { return (c.multi || r !== c.P) ? PLACE[r - c.P] + 'の位の' : ''; }

  // ---------- 見取り算 ----------

  // 竿の数字 d に n を直接いれられるか（繰り上がり・なかま不要）
  function canAdd(d, n) {
    if (n <= 4) return d % 5 + n <= 4;
    if (n === 5) return d < 5;
    return d < 5 && d + n <= 9;
  }

  // 竿の数字 d から n を直接とれるか
  function canSub(d, n) {
    if (n <= 4) return d % 5 >= n;
    if (n === 5) return d >= 5;
    return d >= 5 && d % 5 >= n - 5;
  }

  // 竿 r に n（1〜9）を足す。carry=true は「繰り上がりの10」をいれる時
  function addAt(c, r, n, carry) {
    if (r >= NR) throw new Error('珠が足りません（答えが大きすぎます）');
    var d = c.dg[r], V = function (x) { return String(x * pow10(r - c.P)); }, m = 10 - n;
    var big = String(pow10(r - c.P));

    if (canAdd(d, n)) {
      c.dg[r] = d + n;
      c.push((carry ? big : V(n)) + 'をいれます', { hi: [r] });
      return;
    }
    if (carry) c.push(big + 'をいれます', { hi: [r] });

    if (d + n <= 9) {
      // 5の繰り上がり（なかま）：5を先にいれてから、なかまの数をとる
      c.dg[r] = d + 5;
      c.push(V(n) + 'のなかまは' + V(5 - n) + 'なので、' + V(5) + 'をいれて', { hi: [r] });
      c.dg[r] = d + n;
      c.push(V(5 - n) + 'をとります', { hi: [r] });
      return;
    }
    if (n <= 5 || d % 5 >= m) {
      // 10の繰り上がり（ともだち）：ともだちの数をとってから、10を後にいれる
      c.dg[r] = d - m;
      c.push(V(n) + 'のともだちは' + V(m) + 'なので、' + V(m) + 'をとって', { hi: [r] });
      addAt(c, r + 1, 1, true);
      return;
    }
    // ともだちが使えない：分解
    // 分解：分解の数をいれて → 5をとって → 10をいれる
    var b = n - 5;
    c.dg[r] = d + b;
    c.push(V(n) + 'の分解は' + V(b) + 'なので、' + V(b) + 'をいれて', { hi: [r] });
    c.dg[r] = c.dg[r] - 5;
    c.push(V(5) + 'をとって', { hi: [r] });
    addAt(c, r + 1, 1, true);
  }

  // 竿 r から n（1〜9）を引く。borrow=true は「繰り下がりの10」をとる時
  function subAt(c, r, n, borrow) {
    if (r >= NR) throw new Error('珠が足りません');
    var d = c.dg[r], V = function (x) { return String(x * pow10(r - c.P)); }, m = 10 - n;
    var big = String(pow10(r - c.P));

    if (d >= n) {
      if (canSub(d, n)) {
        c.dg[r] = d - n;
        c.push(borrow ? big + 'をとって' : V(n) + 'をとります', { hi: [r] });
        return;
      }
      // 5の繰り下がり（なかま）：なかまの数をいれてから、5を後にとる
      var k = 5 - n;
      if (borrow) c.push(big + 'をとります', { hi: [r] });
      c.dg[r] = d + k;
      c.push(V(n) + 'のなかまは' + V(k) + 'なので、' + V(k) + 'をいれて', { hi: [r] });
      c.dg[r] = d + k - 5;
      c.push(V(5) + 'をとります', { hi: [r] });
      return;
    }

    // 足りない：上の位から10を借りる（10を先にとってから、ともだちの数をいれる）
    if (borrow) c.push(big + 'をとりたいけど、' + PLACE[r - c.P] + 'の位は' + d + 'で足りません', { hi: [r] });
    if (canAdd(d, m)) {
      c.pre = V(n) + 'のともだちは' + V(m) + 'なので、' + c.pre;
      subAt(c, r + 1, 1, true);
      c.dg[r] = d + m;
      c.push(V(m) + 'をいれます', { hi: [r] });
      return;
    }
    // ともだちが使えない：分解
    // 分解：10をとって → 5をいれて → 分解の数をとる
    var b = n - 5;
    c.pre = V(n) + 'の分解は' + V(b) + 'なので、' + c.pre;
    subAt(c, r + 1, 1, true);
    c.dg[r] = d + 5;
    c.push(V(5) + 'をいれて', { hi: [r] });
    c.dg[r] = d + 5 - b;
    c.push(V(b) + 'をとります', { hi: [r] });
  }

  function parseMitori(str) {
    var s = String(str || '').normalize('NFKC').replace(/[ー−–—－]/g, '-').replace(/,/g, ' ');
    var re = /([+-]?)\s*(\d+)/g, m, nums = [];
    while ((m = re.exec(s)) !== null) nums.push((m[1] === '-' ? -1 : 1) * parseInt(m[2], 10));
    var rest = s.replace(/([+-]?)\s*(\d+)/g, '').replace(/[\s+\-]/g, '');
    if (rest !== '') return { ok: false, error: '数字と ＋ ー だけで入れてね（例：9 + 4 - 8）' };
    return { ok: true, nums: nums };
  }

  function genMitori(nums) {
    if (!nums || nums.length < 2) return { ok: false, error: '2つ以上の数を入れてね（例：9 + 4 - 8）' };
    if (nums.length > 12) return { ok: false, error: '数は12個までにしてね' };
    if (nums[0] <= 0) return { ok: false, error: '最初の数はプラスの数にしてね' };
    var total = 0, i;
    for (i = 0; i < nums.length; i++) {
      if (nums[i] === 0) return { ok: false, error: '0は入れないでね' };
      if (Math.abs(nums[i]) > 99999) return { ok: false, error: '1つの数は5桁までにしてね' };
      total += nums[i];
      if (total < 0) return { ok: false, error: (i + 1) + '番目の数でマイナスになっちゃう。答えがマイナスにならない問題にしてね' };
      if (total > 99999999) return { ok: false, error: '答えが大きすぎるよ' };
    }

    var P = 3, c = new Ctx(P, 'mitori');
    var reading = nums.map(function (v, k) { return k === 0 ? String(v) : (v < 0 ? '− ' : '+ ') + Math.abs(v); }).join(' ');

    var first = digitsOfInt(nums[0]);
    first.forEach(function (d, k) { c.dg[P + first.length - 1 - k] = d; });
    c.push(nums[0] + 'をいれます', { point: '「ご破算」＝珠を全部0にもどすこと。足す・引くは「計算の言葉」、いれる・とるは「珠の動きの言葉」。分けて使うと混乱しないよ' });
    c.settle(nums[0]);

    var run = nums[0];
    for (i = 1; i < nums.length; i++) {
      var v = Math.abs(nums[i]), add = nums[i] > 0, ds = digitsOfInt(v);
      c.multi = ds.length > 1;
      c.push(v + 'を' + (add ? '足します' : '引きます'), { hi: [] });
      for (var k = 0; k < ds.length; k++) {
        if (ds[k] === 0) continue;
        var r = P + ds.length - 1 - k;
        if (add) addAt(c, r, ds[k], false); else subAt(c, r, ds[k], false);
      }
      c.multi = false;
      run += nums[i];
      c.settle(run);
    }
    c.push('答えは' + run + 'となります', { val: run });
    return { ok: true, kind: 'mitori', steps: c.steps, answer: run, P: P, labels: { type: 'place', P: P }, title: reading };
  }

  // ---------- 掛け算（両落とし・前掛け・定位法） ----------

  function genMul(a, b) {
    if (!(a >= 1 && b >= 1) || a % 1 || b % 1) return { ok: false, error: '1以上の整数を入れてね' };
    var da = digitsOfInt(a), db = digitsOfInt(b), A = da.length, B = db.length;
    if (A > 5 || B > 4) return { ok: false, error: 'かけられる数は5桁、かける数は4桁までにしてね' };
    var P = 3, c = new Ctx(P, 'mul');
    c.finger = P + A + B - 1;
    c.push(A + '桁×' + B + '桁なので、' + (A + B) + 'のところに左手を置きます', {
      point: '両落とし：かけられる数もかける数も珠には置かず、答えだけを珠に作る。珠を置き始める位置 ＝ かける数の桁数 ＋ かけられる数の桁数。まずは位取りから始め、左手の人差し指を置く'
    });

    var zeroNoted = false, shownGa = false;
    for (var j = 0; j < B; j++) {
      var bj = db[j], full = bj * pow10(B - 1 - j);
      var round = B > 1 ? a + '×' + full + 'をします。' : '';
      if (bj === 0) {
        c.finger = P + A + B - j - 1;
        c.push(a + '×0は0なので、珠は動かしません', { hi: [] });
        continue;
      }
      for (var i = 0; i < A; i++) {
        var L = A + B - i - j, ai = da[i], prod = ai * bj;
        var rodT = P + L - 1, rodO = P + L - 2;
        c.finger = rodT;
        var lead = '';
        if (i === 0) lead = round + (j === 0 ? '' : '最初に左手を置いたところの' + j + 'つ右から始めます。');
        else lead = '左手を1つ右にずらして、';
        var pt = '';
        if (i === 0 && j === 0) pt = '九九の答えを、左手を置いている場所から入れる';
        else if (i === 1 && j === 0) pt = '計算が終わるたびに、左手を1つ右にずらす';
        else if (i === 0 && j === 1) pt = 'かける数の位ごとに、かけられる数を頭の位から順にかけていく';
        if (prod === 0) {
          c.push(lead + ai + '×' + bj + '=0なので、珠は動かしません', {
            point: zeroNoted ? '' : '0がつく時は、珠を動かさなくても左手は1つ右にずらす',
            hi: [rodT, rodO]
          });
          zeroNoted = true;
          continue;
        }
        var empty = c.dg[rodT] === 0 && c.dg[rodO] === 0;
        var t10 = Math.floor(prod / 10), o1 = prod % 10;
        var body = ai + '×' + bj + '=' + prod + 'なので、' +
          (empty ? t10 + '・' + o1 + 'をいれます' : prod + 'を足します');
        var pt2 = '';
        if (prod < 10 && !shownGa) { pt2 = '九九の答えが1桁（「が」がつく）の時は、十の位に0が入る'; shownGa = true; }
        // 左手の移動と宣言 → 珠の動き、の2ステップに分けて、セリフと動きを揃える
        c.push(lead + ai + 'かける' + bj + 'をします。', { point: pt, hi: [] });
        c.dg = toDigits(fromDigits(c.dg) + prod * pow10(P + L - 2));
        c.push(body, { point: pt2, hi: [rodT, rodO] });
      }
    }
    var ans = a * b;
    c.push('答えは' + ans + 'となります', {
      val: ans,
      point: '答えの一の位が、定位点にくるように位取りしているよ'
    });
    return { ok: true, kind: 'mul', steps: c.steps, answer: ans, P: P, labels: { type: 'pos', P: P, base: 1 }, title: a + ' × ' + b };
  }

  // ---------- 割り算（差引定位法・還元・大還元・九立商） ----------

  function genDiv(x, y) {
    if (!(y >= 1) || !(x >= 1) || x % 1 || y % 1) return { ok: false, error: '1以上の整数を入れてね' };
    var dx = digitsOfInt(x), dy = digitsOfInt(y), nx = dx.length, ny = dy.length;
    if (nx > 8 || ny > 3) return { ok: false, error: '割られる数は8桁、割る数は3桁までにしてね' };
    var P = ny >= 3 ? 6 : 3;
    var c = new Ctx(P, 'div');
    if (x < y) {
      c.push(x + 'は' + y + 'より小さいので、商は0、あまりは' + x + 'です', { val: 0 });
      return { ok: true, kind: 'div', steps: c.steps, answer: 0, remainder: x, P: P, labels: { type: 'pos', P: P, base: 2 }, title: x + ' ÷ ' + y };
    }

    var diff = nx - ny, rodFirst = P - 2 + diff, r0 = P - 1 - ny;
    var d0 = dy[0];
    dx.forEach(function (d, k) { c.dg[rodFirst - k] = d; });
    c.finger = rodFirst;
    c.qFrom = rodFirst + 2;
    var off = diff - 2;
    var posText = off < 0 ? '定位点の' + (-off) + 'つ右' : (off === 0 ? '定位点' : '定位点の' + off + 'つ左');
    c.push(nx + '桁÷' + ny + '桁なので、桁数の差は' + diff + '。' + posText + 'から' + x + 'をいれて、' + dx[0] + 'の下に左手を置きます', {
      point: '差引定位法：割られる数を珠に置いて、答え（商）を左側に立てながら引いていく。置き始める位置 ＝ 割られる数の桁数 − 割る数の桁数（定位点の位は「2」）'
    });

    var leadN = Math.floor(x / pow10(nx - ny));
    var shift = leadN < y ? 1 : 0;
    var shownPt = {};

    for (var j = shift; j <= diff; j++) {
      var F = rodFirst - j;
      c.finger = F;
      c.qFrom = F + 2;
      var lead = '';
      if (j > 0 && j === shift) lead = '先頭の' + leadN + 'は' + y + 'より小さいので、指を1つ右にずらして、';
      else if (j > shift) lead = '左手を1つ右にずらして、';

      var L = c.dg[F + 1] * 10 + c.dg[F];
      var rawq = Math.floor(L / d0), q = Math.min(9, rawq);

      if (q === 0) {
        c.push(lead + L + '÷' + d0 + 'はできないので、答えの位は0です', { hi: [F] });
        continue;
      }
      c.push(lead + L + '÷' + d0 + 'をします。', { hi: [] });
      c.dg[F + 2] = q;
      var qtext = rawq >= 10
        ? '本来は' + rawq + 'ですが、九立商なので9をいれます'
        : L + '÷' + d0 + '=' + q + 'なので、左手の2つ左に' + q + 'をいれます';
      var qpt = '';
      if (rawq >= 10) qpt = '九立商：割られる数と割る数の前の数字が同じで、最後の数字が割る数の方が大きい時、本来10になる商を特別に9として立てる';
      else if (!shownPt.q) qpt = '答えは指の2つ左に置き、その積を引いていく';
      shownPt.q = true;
      c.push(qtext, { point: qpt, hi: [F + 2] });

      var kk = 0, reduced = 0, changed = false;
      while (kk < ny) {
        var pk = q * dy[kk], amt = pk * pow10(F - kk);
        var R = 0;
        for (var rr = 0; rr <= F + 1; rr++) R += c.dg[rr] * pow10(rr);
        var calc = q + '×' + dy[kk] + '=' + pk;
        var pre = changed ? '答えが変わって、' : '';
        if (amt <= R) {
          c.dg = toDigits(fromDigits(c.dg) - amt);
          c.push(pre + calc + 'を引きます', { hi: [F - kk, F - kk + 1] });
          changed = false;
          kk++;
          continue;
        }
        // 引けない → 還元
        reduced++;
        var kind = kk === 1 ? '還元' : '大還元';
        var restoreN = parseInt(dy.slice(0, kk).join(''), 10) * pow10(ny - kk);
        var restoreV = 0;
        for (var t = 0; t < kk; t++) restoreV += dy[t] * pow10(F - t);
        var extra = reduced >= 2 ? '（1回で' + reduced + '度目の還元＝' + reduced + '還）' : '';
        var ptxt = '';
        if (kk === 1 && !shownPt.h) ptxt = '1の位で引けない時は、答えを1つ引いて、10の位の数（割る数の頭の数）を戻す＝還元';
        if (kk >= 2 && !shownPt.H) ptxt = '2桁以上の戻しが発生するのを大還元と言う';
        if (kk === 1) shownPt.h = true; else shownPt.H = true;
        c.push(pre + calc + 'を引きますが、引けません', { hi: [F - kk, F - kk + 1] });
        q -= 1;
        c.dg[F + 2] = q;
        c.dg = toDigits(fromDigits(c.dg) + restoreV);
        c.push('引けないので' + kind + 'を使います。答えの' + (q + 1) + 'を1つ引いて、割る数の' + restoreN + 'を戻します' + extra, {
          point: ptxt, hi: [F + 2, F - kk + 1]
        });
        changed = true;
      }
    }

    c.finger = P - 2;
    c.qFrom = P;
    var full = fromDigits(c.dg), quot = Math.floor(full / pow10(P)), rem = (full - quot * pow10(P)) / pow10(r0);
    var msg = rem === 0
      ? '割り切れましたので、答えは' + quot + 'となります'
      : '答えは' + quot + '、あまりは' + rem + 'となります';
    c.push(msg, { val: quot, point: '答えの一の位が、定位点にくるように位取りしているよ' });
    return { ok: true, kind: 'div', steps: c.steps, answer: quot, remainder: rem, P: P, labels: { type: 'pos', P: P, base: 2 }, title: x + ' ÷ ' + y };
  }

  // ---------- 講師マニュアルのロープレ問題集 ----------

  var SAMPLES = {
    mitori: [
      [9, 4, -8, 5, 2, 4, -3], [7, 8, 9, -7, 6, -8, 5], [4, 3, 7, -6, 4, -7, 8],
      [8, 7, 9, -6, 5, -8, 7], [9, 8, -3, -7, 8, 6, 4], [4, 9, -8, -1, 7, 4, 8],
      [5, 7, -6, 4, 5, 7, -6], [9, 3, -7, -4, 8, 6, 7], [8, 6, -9, -3, 9, -6, 8],
      [4, 2, 8, -6, 4, -7, 9],
      [14, 38, 90, 65, 72], [26, 90, 51, 37, 48], [68, 94, -63, 10, -57],
      [67, 33, -11, -45, 59], [28, 15, 93, -56, 42], [48, 36, 17, -56, 42],
      [84, 16, 80, -74, 61], [64, 51, -97, 40, -23], [28, 64, 51, -97, -23],
      [79, 63, 14, -58, 12]
    ],
    mul: [[364, 4], [123, 3], [501, 8], [57, 34], [32, 29], [501, 24], [325, 48], [108, 75], [271, 74], [939, 32]],
    div: [[46, 2], [135, 3], [2505, 5], [3655, 85], [928, 32], [988, 38], [1890, 27], [3332, 49], [531, 59], [9408, 96], [424767, 537], [146802, 258]]
  };

  var api = {
    NR: NR, PLACE: PLACE, SAMPLES: SAMPLES,
    toDigits: toDigits, fromDigits: fromDigits,
    parseMitori: parseMitori, genMitori: genMitori, genMul: genMul, genDiv: genDiv
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Soroban = api;
})(typeof window !== 'undefined' ? window : globalThis);
