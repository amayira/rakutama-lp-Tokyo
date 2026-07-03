# CLAUDE.md — rakutama-lp-Tokyo

楽珠そろばん教室（練馬区3校）のLP・フォームシステム。

---

## プロジェクト概要

- **サービス**: 楽珠そろばん教室（早宮・氷川台・中村）
- **ドメイン**: rakutama-tokyo.com
- **ホスティング**: GitHub Pages（main ブランチ自動公開）
- **リポジトリ**: https://github.com/amayira/rakutama-lp-Tokyo.git

---

## ディレクトリ構成

```
/
├── index.html              # メインLP
├── trial.html              # 体験申込（ルート）
├── trial-thanks.html       # 体験申込完了
├── access.html             # アクセス・教室情報
├── courses.html            # コース・料金一覧
├── features.html           # 特徴・メリット
├── faq.html                # よくある質問
├── critical-input.html     # Critical CSS 用 FV 断片（最適化用）
│
├── LP/
│   ├── trial.html          # LP版 体験申込（広告流入用）
│   ├── trial-thanks.html   # LP版 申込完了
│   ├── campaign.html       # キャンペーン情報
│   └── coupon.html         # LINEクーポン
│
├── form/
│   ├── index.html          # フォーム選択メニュー
│   ├── taiken.html         # 体験授業申込
│   ├── nyukai.html         # 新規入会申込
│   ├── furikae.html        # 振替受講申込（在学生）
│   ├── kesseki.html        # 欠席報告（在学生）
│   ├── kentei.html         # 検定申込（在学生）
│   ├── class-change.html   # クラス変更申込（在学生）
│   ├── flash-anzan.html    # フラッシュ暗算商品申込（在学生）
│   └── worker.js           # Cloudflare Workers API Proxy
│
├── Pictures/               # 画像素材（教室写真・商品画像）
├── tailwind.config.js      # Tailwind CSS 設定
├── tailwind.css            # ビルド済みCSS（編集しない）
├── tailwind-input.css      # Tailwind ビルド入力ファイル
├── tailwind-critical.config.js  # Critical CSS 用設定
├── critical.css            # ビルド済み Critical CSS
├── package.json
└── CNAME                   # rakutama-tokyo.com
```

---

## 技術スタック

| 種別 | 技術 |
|------|------|
| CSS | Tailwind CSS v3.4.19（CDN ではなく CLI ビルド） |
| アイコン | Font Awesome 6.4.0（CDN） |
| フォント | Noto Sans JP / Zen Kaku Gothic New / Inter（Google Fonts） |
| JS | Vanilla JavaScript（フォーム処理・API通信） |
| API | Cloudflare Workers（form/worker.js） |
| DB | Kintone（cybozu.com） |
| トラッキング | Google Tag Manager（GTM-5K7GZCTN）、Microsoft Clarity |
| ホスティング | GitHub Pages |

### Tailwindカスタムカラー
- `primary`: `#4A96AE`（青緑）
- `secondary`: `#F59E0B`（黄）
- `accent`: 淡青
- `base`: 淡灰

---

## CSS ビルド

Tailwind CSS は CLI でビルド。CDN版ではないため、クラスを追加したら必ずビルドすること。

```bash
# 通常のCSS（tailwind.css）
npx tailwindcss -c tailwind.config.js -i tailwind-input.css -o tailwind.css

# Critical CSS（critical.css）
npx tailwindcss -c tailwind-critical.config.js -i tailwind-input.css -o critical.css
```

`tailwind.css` と `critical.css` は自動生成ファイルのため直接編集しない。

---

## API 構成（form/worker.js）

Cloudflare Workers が静的 GitHub Pages と Kintone の間の API Proxy として機能する。

- **エンドポイント**: `https://rakutama-kintone.k-ariyama.workers.dev`

### APIルート一覧

| メソッド | パス | 用途 | Kintone App |
|---------|------|------|------------|
| GET | `/api/jugyo` | 教室別クラス一覧 | App 6（授業マスタ） |
| GET | `/api/classrooms` | 組織別教室一覧＋開校日 | App 5（教室マスタ） |
| GET | `/api/gakuhi` | 組織別月謝コース一覧 | App 10（月謝マスタ） |
| GET | `/api/furikae-tickets` | 有効振替チケット一覧 | App 14 |
| POST | `/api/lookup` | 生徒番号で生徒情報検索 | App 19（生徒名簿） |
| POST | `/api/taiken` | 体験申込登録 | App 17（体験参加名簿） |
| POST | `/api/nyukai` | 新規入会申込登録 | App 19 |
| POST | `/api/furikae` | 振替受講登録 | App 14（振替管理） |
| POST | `/api/kesseki` | 欠席報告登録 | App 14 |
| POST | `/api/kentei` | 検定申込登録 | App 12（検定申込） |
| POST | `/api/class-change` | クラス変更申込登録 | App 18 |
| POST | `/api/flash-anzan` | フラッシュ暗算申込登録 | App 16 |

### 環境変数（Cloudflare Workers の Wrangler で管理）

```
TOKEN_SEITO_NEW
TOKEN_KYOSHITSU
TOKEN_TAIKEN
TOKEN_FURIKAE
TOKEN_KENTEI
TOKEN_CLASS_CHANGE
TOKEN_SONOTA
TOKEN_JUGYO
TOKEN_GAKUHI
```

### CORS 許可オリジン
- `rakutama-tokyo.com`
- `form.rakutama-tokyo.com`
- `form.rakutama-soroban.com`
- `amayira.github.io`

### 新規入会の生徒番号採番
入会申込時、生徒番号は `要修正&{5桁乱数}` で仮登録される。管理画面で手動修正が必要。

### トークン組み合わせルール

| ハンドラ | 使用トークン | 理由 |
|---------|------------|------|
| `handleKesseki` | `TOKEN_FURIKAE + TOKEN_SEITO_NEW + TOKEN_KYOSHITSU` | 振替教室名（ルックアップ型）の参照先アクセスに TOKEN_KYOSHITSU が必要 |
| `handleFurikae` | `TOKEN_FURIKAE + TOKEN_SEITO_NEW + TOKEN_KYOSHITSU` | 同上 |
| `handleTaiken` | `TOKEN_TAIKEN + TOKEN_KYOSHITSU` | 教室名（ルックアップ型）の参照先アクセス |
| `handleNyukai` | `TOKEN_SEITO_NEW + TOKEN_KYOSHITSU + TOKEN_GAKUHI` | ルックアップ型フィールド複数 |

> **ルール**: ルックアップ型フィールドを含むレコードを POST/PUT する場合、そのルックアップ参照先アプリのトークンも連結して渡す必要がある。
> 参照先アプリが教室マスタ → `TOKEN_KYOSHITSU` を追加。

---

## Kintone フィールド仕様

### App 14（振替管理）フィールド一覧

| フィールドコード | 型 | 説明 |
|---------------|------|------|
| `生徒番号` | 文字列 | 生徒番号（例: A0001） |
| `教室名` | ルックアップ | 生徒のホーム教室 |
| `欠席日` | 日付 | 欠席した日（YYYY-MM-DD） |
| `振替期日_始_` | 日付 | 振替取得期限・開始（欠席日の1ヶ月前） |
| `振替期日_終_` | 日付 | 振替取得期限・終了（欠席日の1ヶ月後） |
| `振替受講日` | 日付 | 振替で受講する日（YYYY-MM-DD） |
| `振替教室名` | ルックアップ | 振替受講する教室（別教室可） |
| `時刻` | **時刻型** | `HH:MM:SS` 形式必須（例: `16:00:00`） |
| `備考` | 文字列（複数行） | 自由記入 |

> **注意**: `時刻` は Kintone の時刻型フィールドのため、フォームから「16時」で受け取っても worker.js 内の `toKintoneTime()` で `HH:MM:SS` に変換して送信する。

### `toKintoneTime()` 変換ルール（worker.js）

```
"16時"     → "16:00:00"
"17時"     → "17:00:00"
"16:00"    → "16:00:00"
"16:00:00" → "16:00:00"（そのまま）
""         → ""（空はそのまま）
```

---

### GET /api/classrooms の仕様

- クエリ: `orgCode`（必須。フォーム側が `DOMAIN_ORG_MAP[hostname]` で決定）
- 返却: `{ success, classrooms: [{ name, openDate }] }`
- 抽出条件: `組織選択 in (orgCode)` **かつ 開校日が入力済み** かつ 開校状況に「閉」を含まない
  - → **教室マスタに開校日を入れた教室だけがフォームに出る**（開校日未定の準備中校は出ない）
- フォーム側の使い方: 教室セレクタを動的生成＋開校日より前の日付を選択不可にクランプ
  - trial.html / LP/trial.html / form/taiken.html：日付プルダウンの開始日 = max(最短予約日, 開校日)
  - form/nyukai.html：希望入会日 input の `min` に開校日を設定
  - API失敗時はHTML直書きの教室選択肢にフォールバック（各HTMLに直書きも残してある）
- **新教室の追加手順**: kintone教室マスタに登録（組織選択・開校日必須）→ 授業マスタにクラス登録 → フォームは自動反映（HTML修正不要）

## フォーム仕様（form/）

### 共通：生徒番号検索（Lookup）

全在学生向けフォームで共通の動作：
1. 生徒番号を入力して「検索」→ `/api/lookup` (POST) を呼ぶ
2. 返却値: `{ success, student: { familyName, givenName, records: [{ studentNumber, classroom, billingId, jugyoIds[] }] } }`
   ※ 週2コース（A0001 + A0001-2）は `records` に複数レコードが入る
3. 検索成功後にフォームフィールドが有効化される（それまで submit 不可）

### 共通：教室選択 → 時刻プルダウン連動

振替・欠席フォームともに教室セレクタを持つ：
- 生徒番号検索後にホーム教室をプリセット（`s.records[0].classroom`）、`disabled` 解除
- 別教室に変更すると `/api/jugyo?classroom=<name>` を再取得し時刻を再描画
- 時刻の表示形式: `「16時」「17時」`（cls.name から `/(\d+)時/` で抽出・重複除去）
- 送信値: `「16時」` のまま送信 → worker.js の `toKintoneTime()` で変換

### furikae.html（振替受講申込）

| 項目 | 必須 | 説明 |
|------|------|------|
| 振替受講教室 | ○ | 教室セレクタ（3校） |
| 振替受講日 | ○ | date input |
| 使用するチケット | ○ | `/api/furikae-tickets` から取得（生徒番号＋日付で絞込） |
| 時刻 | 任意 | 教室連動プルダウン |
| 備考 | 任意 | 自由記入 |

送信先: `POST /api/furikae` → App 14 の既存レコード（チケット）を **UPDATE**

### kesseki.html（欠席連絡）

| 項目 | 必須 | 説明 |
|------|------|------|
| 欠席日 | ○ | date input / 振替期日を自動計算（前後1ヶ月） |
| 振替受講教室 | 任意 | 教室セレクタ（3校）。「未定」チェックで非表示 |
| 振替受講日 | 任意 | 「未定」チェックで非表示 |
| 時刻 | 任意 | 教室連動プルダウン |
| 備考 | 任意 | 自由記入 |

送信先: `POST /api/kesseki` → App 14 に新規レコードを **POST**

---

## Kintone アプリ一覧

| App ID | 用途 |
|--------|------|
| 5 | 教室マスタ（全組織共通45教室。組織選択・開校日・開校状況） |
| 6 | 授業マスタ（授業ID・曜日・開始時刻） |
| 10 | 月謝マスタ（コース名・料金・組織別） |
| 12 | 検定申込 |
| 14 | 振替管理 |
| 16 | その他請求（フラッシュ暗算等） |
| 17 | 体験参加名簿 |
| 18 | クラス変更申込 |
| 19 | 生徒名簿（統合版・現行） |

---

## トラッキング

- **GTM Container ID**: `GTM-5K7GZCTN`（全ページに実装済み）
- **GA4 カスタムイベント**:
  - `click_map`: Googleマップリンククリック（`school` パラメータで教室判別）
- **Microsoft Clarity**: セッション録画・ユーザー行動分析

GTMスニペットは `<head>` 内（同期）と `<body>` 直後（`<noscript>` iframe）の両方に配置すること。

### CV（コンバージョン）計測

- **CVページ**: `trial-thanks.html`（ルート直下）のページビューをCV地点として計測
- フォーム送信完了後は必ずこのページにリダイレクトすること
  - `trial.html`（体験申込）→ `trial-thanks.html`
  - `LP/trial.html`（LP版体験申込）→ `LP/trial-thanks.html`（LP版サンクス）※LP版はLP内で完結
  - `form/taiken-nakamura.html`（中村校体験会）→ `../trial-thanks.html`

### 広告ランディングページ

| 媒体 | ランディングページ |
|------|------------------|
| Google 広告 | `https://rakutama-tokyo.com/`（トップページ） |
| Meta 広告（Facebook/Instagram） | `https://rakutama-tokyo.com/LP/trial.html` |

---

## デプロイフロー

1. HTML/CSS/JS を編集
2. Tailwind を使った場合は CSS をビルド
3. `git push origin main` → GitHub Pages に自動反映

Cloudflare Workers（form/worker.js）の変更は別途 `wrangler deploy` が必要。

---

## 注意事項

- `tailwind.css` / `critical.css` はビルド成果物。直接編集しない。
- `worker.js` のデプロイは GitHub Push では反映されない（Cloudflare Workers 側の作業が必要）。
- 新規ページを追加する場合は `tailwind.config.js` の `content` に追加が必要な場合がある。
- 全ページに GTM スニペットを必ず入れること。
- `form/` 配下のページは在学生向けのため、LP とはデザイン・トーンが異なる。
- **OneDrive上の.gitに注意**：OneDriveのストレージ節約機能で `.git/objects` がdataless（クラウド退避）化すると `git push` が固まる（2026-07-03発生）。対処：①Finderでこのフォルダを「このデバイス上に常に保持」に設定、②pushが固まる場合は GitHubから浅くclone → `git show main:ファイル` で変更ファイルを移植 → cloneからpush → 元リポジトリで `git fetch && git reset --soft origin/main`。

---

## LP ページタイトルルール

`LP/` 配下のページタイトルは必ず `【】`（隅付き括弧）で始めること。

- 例: `【無料体験申込】楽珠そろばん教室 東京・練馬（早宮・氷川台・中村）`
- 例: `【申込完了】楽珠そろばん教室 東京・練馬`
- 通常ページ（ルート配下）との区別のためのルール。
