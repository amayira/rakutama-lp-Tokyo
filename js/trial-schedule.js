// ─────────────────────────────────────────────────────────────────────────────
// 体験申込フォーム共通の日程ロジック（trial.html / LP/trial.html / form/taiken.html）
//   依存: /js/form-common.js（API_BASE / ORG_CODE / classroomOpenDates / loadClassroomsInto）
//   各ページは initTrialSchedule({...}) を呼び、送信処理だけページ側に持つ。
//   休講日・臨時開講日はこのファイルだけ直せば3ページ全てに反映される。
// ─────────────────────────────────────────────────────────────────────────────

// APIと同じ内容（CORSで取得できない環境向けフォールバック）
const FALLBACK_JUGYO_BY_CLASSROOM = {
  '早宮校': [
    { name: '早宮校(火)16時クラス' },
    { name: '早宮校(火)17時クラス' },
    { name: '早宮校(金)16時クラス' },
    { name: '早宮校(金)17時クラス' },
  ],
  '氷川台校': [
    { name: '氷川台校(月)16時クラス' },
    { name: '氷川台校(月)17時クラス' },
    { name: '氷川台校(水)16時クラス' },
    { name: '氷川台校(水)17時クラス' },
  ],
  '中村校': [
    { name: '中村校(月)16時クラス' },
    { name: '中村校(月)17時クラス' },
    { name: '中村校(木)16時クラス' },
    { name: '中村校(木)17時クラス' },
  ],
};

const JP_TO_DAY = { '日': 0, '月': 1, '火': 2, '水': 3, '木': 4, '金': 5, '土': 6 };

// 年間スケジュール（Pictures/2026schedule.pdf）で「休」「祝休」となっている全教室共通の休校日
// （教室ごとの開講曜日でない日は allowedDays 側で自然に除外される）
const BLOCKED_DATES = new Set([
  '2026-04-29', '2026-04-30', '2026-05-01', '2026-05-02', '2026-05-04', '2026-05-05', '2026-05-06',
  '2026-06-27', '2026-07-03', '2026-07-20',
  '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15',
  '2026-09-21', '2026-09-22', '2026-09-23',
  '2026-10-09', '2026-10-12', '2026-10-29',
  '2026-11-03', '2026-11-23',
  '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31',
  '2027-01-01', '2027-01-02', '2027-01-11',
  '2027-02-11', '2027-02-23',
  '2027-03-10'
]);

// 通常開講曜日以外の臨時開講日（教室別）
const EXTRA_DATES_BY_CLASSROOM = {
  '早宮校': [
    { date: new Date(2026, 5, 4),  label: '2026年6月4日(木)',  display: '6月4日（木）【臨時】',  times: ['16:00', '17:00'] },
    { date: new Date(2026, 5, 11), label: '2026年6月11日(木)', display: '6月11日（木）【臨時】', times: ['16:00', '17:00'] },
  ]
};

let lastJugyoByDay = null;
let currentClassroom = null;
let trialClassroomSelectId = 'classroom';
let trialMinDateMode = 'today';

// 最短予約日：
//   'today'     … 当日から（form/taiken.html・LP/trial.html の従来挙動）
//   'nextDay18' … 翌日から・18時以降の申込は翌々日から（trial.html の従来挙動）
function trialMinBaseDate() {
  if (trialMinDateMode === 'nextDay18') {
    const now = new Date();
    const minOffset = now.getHours() < 18 ? 1 : 2; // 18時以降は翌々日から
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() + minOffset);
    minDate.setHours(0, 0, 0, 0);
    return minDate;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseJugyoClassesToSchedule(classList) {
  const byDay = new Map();
  (classList || []).forEach(({ name }) => {
    const m = String(name).match(/\(([月火水木金土日])\)(\d{1,2})時/);
    if (!m) return;
    const day = JP_TO_DAY[m[1]];
    const t = `${String(Number(m[2])).padStart(2, '0')}:00`;
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day).add(t);
  });
  return byDay;
}

function buildDateSelectForSchedule(sel, allowedDays, noClassroomYet, classroom) {
  const wdays = ['日', '月', '火', '水', '木', '金', '土'];
  const daysAhead = 90;
  // 開校日（教室マスタ）より前は選択不可。開校日が未取得の教室は制限なし
  const openDate = classroom ? classroomOpenDates[classroom] : '';
  const earliest = openDate ? new Date(`${openDate}T00:00:00`) : new Date(0);
  const minDate = trialMinBaseDate();
  const base = minDate < earliest ? new Date(earliest) : new Date(minDate);
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  if (allowedDays && allowedDays.size) ph.textContent = '選択してください';
  else if (noClassroomYet) ph.textContent = '先に希望教室を選択してください';
  else ph.textContent = '開講情報を取得できませんでした';
  sel.appendChild(ph);
  if (!allowedDays || !allowedDays.size) return;
  const blocked = BLOCKED_DATES;
  const extras = EXTRA_DATES_BY_CLASSROOM[classroom] || [];
  let extraIdx = 0;
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    while (extraIdx < extras.length && extras[extraIdx].date < d) {
      if (extras[extraIdx].date >= base) {
        const e = extras[extraIdx];
        const opt = document.createElement('option');
        opt.value = e.label;
        opt.textContent = e.display;
        sel.appendChild(opt);
      }
      extraIdx++;
    }
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (blocked.has(key)) continue;
    if (!allowedDays.has(d.getDay())) continue;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${wdays[d.getDay()]})`;
    const opt = document.createElement('option');
    opt.value = label;
    opt.textContent = label;
    sel.appendChild(opt);
  }
  while (extraIdx < extras.length) {
    if (extras[extraIdx].date >= base) {
      const e = extras[extraIdx];
      const opt = document.createElement('option');
      opt.value = e.label;
      opt.textContent = e.display;
      sel.appendChild(opt);
    }
    extraIdx++;
  }
}

function buildTimeSelectForChosenDate(timeSel, byDay, dateLabel) {
  timeSel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = '選択してください';
  timeSel.appendChild(ph);
  if (!dateLabel) return;
  const extras = EXTRA_DATES_BY_CLASSROOM[currentClassroom] || [];
  const extraMatch = extras.find(e => e.label === dateLabel);
  if (extraMatch) {
    extraMatch.times.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      timeSel.appendChild(opt);
    });
    return;
  }
  if (!byDay || !byDay.size) return;
  const m = dateLabel.match(/\(([月火水木金土日])\)$/);
  if (!m) return;
  const day = JP_TO_DAY[m[1]];
  const times = byDay.get(day);
  if (!times || !times.size) return;
  [...times].sort().forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    timeSel.appendChild(opt);
  });
}

function applyPreferenceDropdownsForSchedule(byDay, noClassroomYet, classroom) {
  currentClassroom = classroom || null;
  lastJugyoByDay = (byDay && byDay.size) ? byDay : null;
  const allowed = lastJugyoByDay ? new Set(lastJugyoByDay.keys()) : null;
  buildDateSelectForSchedule(document.getElementById('pref1-date'), allowed, noClassroomYet, currentClassroom);
  buildDateSelectForSchedule(document.getElementById('pref2-date'), allowed, noClassroomYet, currentClassroom);
  buildTimeSelectForChosenDate(document.getElementById('pref1-time'), lastJugyoByDay, '');
  buildTimeSelectForChosenDate(document.getElementById('pref2-time'), lastJugyoByDay, '');
}

function mergePreferredDatetimeForKintone() {
  const d1 = document.getElementById('pref1-date').value.trim();
  const t1 = document.getElementById('pref1-time').value.trim();
  const d2 = document.getElementById('pref2-date').value.trim();
  const t2 = document.getElementById('pref2-time').value.trim();
  if (!d1 || !t1 || !d2 || !t2) return '';
  return `第1希望：${d1} ${t1} ／ 第2希望：${d2} ${t2}`;
}

function renderJugyoBadges(listEl, classes, usedFallback) {
  listEl.innerHTML = '';
  classes.forEach(cls => {
    const badge = document.createElement('span');
    badge.className = 'inline-block bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-full px-3 py-1';
    badge.textContent = cls.name;
    listEl.appendChild(badge);
  });
  if (classes.length === 0) {
    listEl.innerHTML = '<span class="text-xs text-gray-400">開講中のクラスが見つかりませんでした</span>';
  } else if (usedFallback) {
    const note = document.createElement('p');
    note.className = 'w-full text-[11px] text-gray-400 mt-2';
    note.textContent = '※最新の空き状況は別途ご確認ください（一覧は参考表示です）';
    listEl.appendChild(note);
  }
}

function initTrialSchedule({ classroomSelectId = 'classroom', minDateMode = 'today' } = {}) {
  trialClassroomSelectId = classroomSelectId;
  trialMinDateMode = minDateMode;

  loadClassroomsInto(classroomSelectId);

  document.getElementById('pref1-date').addEventListener('change', function () {
    buildTimeSelectForChosenDate(document.getElementById('pref1-time'), lastJugyoByDay, this.value);
  });
  document.getElementById('pref2-date').addEventListener('change', function () {
    buildTimeSelectForChosenDate(document.getElementById('pref2-time'), lastJugyoByDay, this.value);
  });

  // 希望教室 → 開講クラス一覧 ＋ 希望日時プルダウン
  document.getElementById(classroomSelectId).addEventListener('change', async function () {
    const classroom = this.value;
    const section = document.getElementById('schedule-section');
    const spinner = document.getElementById('schedule-spinner');
    const list = document.getElementById('schedule-list');

    list.innerHTML = '';
    if (!classroom) {
      section.classList.add('hidden');
      applyPreferenceDropdownsForSchedule(null, true);
      return;
    }

    let effectiveClasses = FALLBACK_JUGYO_BY_CLASSROOM[classroom] || [];

    section.classList.remove('hidden');
    spinner.classList.remove('hidden');

    try {
      const res = await fetch(`${API_BASE}/api/jugyo?classroom=${encodeURIComponent(classroom)}`);
      const data = await res.json();
      const classes = Array.isArray(data?.classes) ? data.classes : [];
      if (!res.ok || !data.success) throw new Error('api');
      renderJugyoBadges(list, classes, false);
      if (classes.length) effectiveClasses = classes;
    } catch {
      const fb = FALLBACK_JUGYO_BY_CLASSROOM[classroom];
      if (fb && fb.length) {
        renderJugyoBadges(list, fb, true);
        effectiveClasses = fb;
      } else {
        list.innerHTML = '<span class="text-xs text-red-400">クラス情報の取得に失敗しました</span>';
        effectiveClasses = [];
      }
    } finally {
      spinner.classList.add('hidden');
    }

    const byDay = parseJugyoClassesToSchedule(effectiveClasses);
    applyPreferenceDropdownsForSchedule(byDay.size ? byDay : null, false, classroom);
  });

  applyPreferenceDropdownsForSchedule(null, true);

  // 級・段 フィールドの表示切替
  document.querySelectorAll('input[name="experience"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const levelField = document.getElementById('level-field');
      levelField.classList.toggle('hidden', radio.value !== 'あり' || !radio.checked);
    });
  });
}
