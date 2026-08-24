// ─────────────────────────────────────────────────────────────────────────────
// フォーム共通処理（全フォームで読み込む）
//   <script src="/js/form-common.js"></script> を各ページの実装スクリプトより前に置く。
//   ここの関数・変数はページ側スクリプトからグローバルとして参照される。
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = 'https://rakutama-kintone.k-ariyama.workers.dev';

// ── 組織判定：ドメイン → kintone の組織コード（教室マスタ・月謝マスタの絞込に使用）──
const DOMAIN_ORG_MAP = {
  'form.rakutama-tokyo.com':   'アルファーブレイン',
  'rakutama-tokyo.com':        'アルファーブレイン',
  'form.rakutama-soroban.com': '本部',
  'amayira.github.io':         'アルファーブレイン',
};
const ORG_CODE = DOMAIN_ORG_MAP[window.location.hostname] ?? 'アルファーブレイン';

// ── 教室一覧を教室マスタ（App 5）から動的取得 ──
// 成功時はHTML直書きの選択肢を置き換える。失敗時は直書きのままフォールバック。
// 開校日は classroomOpenDates（教室名 → YYYY-MM-DD）に保持し、日付クランプに使う。
let classroomOpenDates = {};

async function loadClassroomsInto(selectId) {
  try {
    const res = await fetch(`${API_BASE}/api/classrooms?orgCode=${encodeURIComponent(ORG_CODE)}`);
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.classrooms) || !data.classrooms.length) return;
    const sel = document.getElementById(selectId);
    const current = sel.value;
    sel.innerHTML = '<option value="">選択してください</option>';
    classroomOpenDates = {};
    data.classrooms.forEach(c => {
      const opt = document.createElement('option');
      opt.textContent = c.name;
      sel.appendChild(opt);
      if (c.openDate) classroomOpenDates[c.name] = c.openDate;
    });
    if (current && [...sel.options].some(o => o.value === current)) sel.value = current;
  } catch { /* フォールバック：HTML直書きの選択肢のまま */ }
}

// ── 教室 → 時刻プルダウン連動（欠席・振替フォーム）──
// 授業マスタのクラス名から「16時」「17時」を抽出して selectId に描画する。
async function loadTimeSlotsInto(selectId, classroom) {
  const timeSelect = document.getElementById(selectId);
  timeSelect.innerHTML = '<option value="">選択してください</option>';
  if (!classroom) return;
  try {
    const jRes = await fetch(`${API_BASE}/api/jugyo?classroom=${encodeURIComponent(classroom)}`);
    const jData = await jRes.json();
    if (jRes.ok && jData.success) {
      const seen = new Set();
      jData.classes.forEach(cls => {
        const m = String(cls.name).match(/(\d+)時/);
        if (!m) return;
        const label = `${m[1]}時`;
        if (seen.has(label)) return;
        seen.add(label);
        const opt = document.createElement('option');
        opt.value = label;
        opt.textContent = label;
        timeSelect.appendChild(opt);
      });
    }
  } catch { /* 取得失敗は無視 */ }
}

// ── 生徒番号検索（在学生向けフォーム共通）──
// 共通のDOM ID規約: student-number / lookup-btn / lookup-text / lookup-spinner /
//                   lookup-error / student-info / info-classroom / info-jugyo /
//                   submit-btn / submit-hint
// 検索結果は studentData（グローバル）に入る。週2コースは student.records に複数レコード。
let studentData = null;

function setupStudentLookup({ onReset, onSuccess, enableSubmitOnSuccess = true } = {}) {
  document.getElementById('lookup-btn').addEventListener('click', async () => {
    const studentNumber = document.getElementById('student-number').value.trim();
    const lookupError = document.getElementById('lookup-error');
    const studentInfo = document.getElementById('student-info');
    const lookupBtn = document.getElementById('lookup-btn');
    const lookupText = document.getElementById('lookup-text');
    const lookupSpinner = document.getElementById('lookup-spinner');

    lookupError.classList.add('hidden');
    studentInfo.classList.add('hidden');
    studentData = null;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('submit-hint').classList.remove('hidden');
    if (onReset) onReset();

    if (!studentNumber) {
      lookupError.textContent = '生徒番号を入力してください';
      lookupError.classList.remove('hidden');
      return;
    }

    lookupBtn.disabled = true;
    lookupText.textContent = '検索中...';
    lookupSpinner.classList.remove('hidden');

    try {
      const response = await fetch(`${API_BASE}/api/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentNumber }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('生徒番号が見つかりませんでした。番号をご確認ください。');
        throw new Error(`エラーが発生しました（${response.status}）`);
      }

      const data = await response.json();
      studentData = data;
      const s = data.student;

      // 全レコードの教室名・コマをまとめて表示（週2コースは複数レコードを持つ）
      const allClassrooms = [...new Set(s.records.map(r => r.classroom).filter(Boolean))];
      const allJugyo = s.records.flatMap(r => r.jugyoIds);
      document.getElementById('info-classroom').textContent = allClassrooms.join('・') || '―';
      document.getElementById('info-jugyo').textContent = allJugyo.length > 0 ? allJugyo.join('、') : '―';
      studentInfo.classList.remove('hidden');
      if (enableSubmitOnSuccess) {
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-hint').classList.add('hidden');
      }
      if (onSuccess) await onSuccess(s);

    } catch (err) {
      lookupError.textContent = err.message || '検索中にエラーが発生しました。';
      lookupError.classList.remove('hidden');
    } finally {
      lookupBtn.disabled = false;
      lookupText.textContent = '検索';
      lookupSpinner.classList.add('hidden');
    }
  });

  document.getElementById('student-number').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('lookup-btn').click(); }
  });
}

// ── 当日締切チェック（欠席連絡・振替予約共通）──
// ⚠️ ユーザー向け表示・エラー文言は「14:30まで」だが、実際の受付猶予は14:45まで（2026-08-19、有山さん指示）。
// dateValue が「今日」で、かつ現在時刻が締切を過ぎていれば true。過去日・未来日は対象外。
function isTodayPastCutoff(dateValue, cutoffHour = 14, cutoffMinute = 45) {
  if (!dateValue) return false;
  const now = new Date();
  const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (dateValue !== todayYMD) return false;
  const cutoff = new Date(now);
  cutoff.setHours(cutoffHour, cutoffMinute, 0, 0);
  return now > cutoff;
}

// ── 入力途中の離脱ガード（未送信の入力がある状態でページ遷移しようとしたら確認）──
// 1つでもフォームに入力があると、リロード・タブを閉じる・別ページへの遷移時に
// ブラウザ標準の確認ダイアログ（「このサイトを離れますか？」）を出す。
// ※ダイアログの文言はブラウザ仕様で固定のため変更不可。
// フォーム送信時（サンクスページへのリダイレクト・完了画面表示）はガードを解除する。
// デフォルトでは無効。有効にするページは form-common.js を読み込む前に
// <script>window.ENABLE_UNLOAD_GUARD = true;</script> を置くこと（体験申込フォームのみ使用）。
(function setupUnloadGuard() {
  if (!window.ENABLE_UNLOAD_GUARD) return;
  let allowUnload = false;

  // 何か1つでも初期状態から変更された入力があるか
  function isDirty() {
    const fields = document.querySelectorAll('input, select, textarea');
    for (const el of fields) {
      if (el.disabled || el.readOnly) continue;
      const type = (el.type || '').toLowerCase();
      if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') continue;

      if (type === 'checkbox' || type === 'radio') {
        if (el.checked !== el.defaultChecked) return true;
      } else if (el.tagName === 'SELECT') {
        // プレースホルダ（value=""）以外が選ばれていれば入力あり
        if (el.value !== '') return true;
      } else {
        if (el.value !== el.defaultValue && el.value.trim() !== '') return true;
      }
    }
    return false;
  }

  window.addEventListener('beforeunload', (e) => {
    if (allowUnload) return;
    if (!isDirty()) return;
    e.preventDefault();
    e.returnValue = ''; // Chrome等で確認ダイアログを出すために必要
  });

  // フォーム送信が始まったらガード解除（正規のリダイレクト・完了画面を妨げない）
  document.addEventListener('submit', () => { allowUnload = true; }, true);
})();
