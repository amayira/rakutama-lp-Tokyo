# リファクタリング計画（2026-07-04 策定）

楽珠そろばん教室 LP・フォームシステムの段階的リファクタリング計画。
各フェーズは独立してデプロイ可能。**上から順に実行する**（低リスク→高リスクの順）。

---

## 現状診断（2026-07-04 時点の実測）

| # | 問題 | 実測値 | 影響 |
|---|------|--------|------|
| 1 | CDN版Tailwindが本番稼働 | **21ページ**が `cdn.tailwindcss.com`（開発専用・非推奨）を使用。CLIビルド済み `tailwind.css` を使うのは LP4ページのみ。CLAUDE.mdの「CDNではなくCLIビルド」は実態と不一致 | ページ毎に約110KBのJITコンパイラJSが実行され表示速度・広告品質スコアに悪影響 |
| 2 | インライン `tailwind.config` の重複 | 21ページに同じ設定ブロックがコピペ | 色変更が21ファイル修正になる |
| 3 | Critical CSS パイプラインが死んでいる | `critical.css` を読むページ **0件**。`critical-input.html` / `tailwind-critical.config.js` / `critical.css` は完全な死骸 | 混乱の元。ビルド手順が2系統あるように見える |
| 4 | 期限切れページが公開中 | 体験会LP3枚（`LP/*-workshop.html`、2026年6月開催・各約950行）と `form/taiken-nakamura.html`（6月日程のプルダウン） | 今申し込むと過去日程を選ばされる事故リスク |
| 5 | 巨大画像 | Pictures/ 計 **26MB**。`nakamura_inside.png` 8.3MB、`background3.png` 8MB（index.htmlの背景！）、`tamakurou.png` 3.3MB、`favicon.png` 565KB | LCP悪化・モバイル通信量。集客LPとして致命的 |
| 6 | JSの全面コピペ | `API_BASE` が13ファイル、生徒番号lookup処理が5フォーム、教室→時刻連動が6ページ、`DOMAIN_ORG_MAP`＋教室マスタ取得＋フォールバックが4ページに重複。共有JSファイルはゼロ | 6/3の教室マスタ連動改修のような変更が毎回4〜6ファイル同時修正になる |
| 7 | trial.html と LP/trial.html がほぼ別実装 | diff 2,157行（両方とも同じ体験申込フォーム） | 休講日修正などを毎回2重メンテ |
| 8 | package.json の矛盾 | `tailwindcss` v3.4.19 と `@tailwindcss/cli` v4.2.2 が同居（v4 CLIはv3 configと非互換） | ビルドコマンドが将来壊れる時限爆弾 |
| 9 | GTM未設置ページ | form/ 配下6フォーム＋staff/ 2ページ＋critical-input.html | CLAUDE.mdの「全ページGTM必須」違反（在学生フォームの計測欠落） |
| 10 | worker.js が単一999行 | 32関数が1ファイル。ルーティングもif連鎖 | 変更時の見通しが悪い（ただし動作は安定） |
| 11 | 細かいゴミ | `form/.DS_Store` がトラッキング対象、`form/schedule.html` だけ配色が別系統（緑） | — |

---

## フェーズ 0：安全網の整備（✅ 2026-07-04 完了）

リファクタリングの事故防止。**このリポジトリにはテストが無い**ので、手動検証チェックリストが安全網になる。

- [x] `git tag pre-refactor-20260704` を打った（いつでも戻れる地点）
- [x] 検証チェックリストを本ファイル末尾に固定（フォーム8種の送信テスト手順）
- [ ] Lighthouse で `index.html` / `LP/trial.html` の現状スコアを記録（フェーズ2着手前に実施）
- [x] kintone側はテストレコードを消せば済むので、送信テストは本番APIで実施可

**ベースライン記録（2026-07-04）**: Pictures/ 26MB・tailwind.css 42KB・CDN Tailwind 21ページ

**リスク: なし**

---

## フェーズ 1：死骸の除去（✅ 2026-07-04 完了）

動いているコードに触らず、参照されていないもの・期限切れのものを消す。

**有山さん確認結果（2026-07-04）**: nakamura-workshop のみチラシ流入の可能性あり。その他のLP（hayamiya/hikawadai体験会・campaign・coupon）は稼働していない。

### 1-1. 期限切れページの取り下げ
- [x] `LP/hayamiya-workshop.html` / `LP/hikawadai-workshop.html` を削除（2026年6月体験会・終了済み）
- [x] `LP/campaign.html` / `LP/coupon.html` を削除（稼働終了を有山さん確認済み）
- [x] `LP/nakamura-workshop.html` → チラシQR流入の受け皿として `trial.html?utm_source=chirashi&utm_medium=qr&utm_campaign=nakamura_workshop` へのリダイレクトスタブに差し替え（UTMで流入量を計測可能）
- [x] `form/taiken-nakamura.html` → 同じリダイレクトスタブに差し替え（6月日程しか選べず申込事故になるため）
- [x] `sitemap.xml` から nakamura-workshop を除去

### 1-2. 死んだCritical CSSパイプラインの削除
- [x] `critical.css` / `critical-input.html` / `tailwind-critical.config.js` を削除（参照0件を確認済み）
- [x] CLAUDE.md から Critical CSS の記述を削除

### 1-3. その他のゴミ
- [x] `form/.DS_Store` を `git rm --cached`（`.gitignore` には既に記載あり）
- [x] 未参照画像の削除: `tamakurou.png`（3.1MB）・`soroban.png`（356KB）— 削除したLP専用画像で孤児化したもの
- [x] `package.json` から `@tailwindcss/cli` (v4) を削除し v3 系に一本化。`npm run build:css` スクリプトを追加しビルド確認済み（248ms）

**リスク: 低**（全て `pre-refactor-20260704` タグから復元可能）

---

## フェーズ 2：CSS一本化（CDN Tailwind → CLIビルド）★効果最大

21ページの CDN Tailwind をビルド済み `tailwind.css` に置き換える。表示速度改善の本丸。

### 手順
1. [ ] `tailwind.config.js` の `content` に全HTML（`./*.html`, `./LP/*.html`, `./form/*.html`, `./staff/*.html`）が含まれるか確認・追記
2. [ ] 各ページのインライン `tailwind.config = {...}` を精査し、共通config（primary/secondary/accent/base/フォント）との差分を洗い出す
   - `form/schedule.html` の `primary: '#22C55E'`（緑）のような**ページ固有色**は、共通configに `green` 系として追加するか、そのページ専用のユーティリティクラスに置換
3. [ ] ビルド実行 → `tailwind.css` 再生成
4. [ ] ページを**グループ単位**で置換（`<script src="cdn...">` ＋インラインconfig → `<link rel="stylesheet" href="/tailwind.css">`）:
   - グループA: 静的ページ（index / access / courses / features / faq / 404 / trial-thanks）
   - グループB: フォーム（trial / form/配下8種）
   - グループC: LP（campaign / coupon / trial-thanks）・staff/ 2ページ
5. [ ] グループごとにコミット＆全ページ目視比較（プレビューでスクリーンショット比較）
6. [ ] CDN の `plugins: [forms]` 等を使っているページがないか事前grep（あれば `@tailwindcss/forms` をビルドに追加）

### 注意点
- CDN版はJITで**全クラス使用可能**だが、ビルド版は `content` でスキャンされたクラスのみ生成。**JSで動的生成しているクラス名**（例: `classList.add('bg-red-500')`）が漏れやすい → 事前に `grep -rn "classList\|className" **/*.html` で動的クラスを洗い出し `safelist` に追加
- 1ページずつ確実に。崩れたページだけ即revertできる粒度でコミット

**検証**: 全21ページのビフォーアフター目視 ＋ Lighthouseスコア比較。
**リスク: 中**（見た目崩れ。ただし即時発見・即時revert可能）

---

## フェーズ 3：画像最適化（26MB → 目標3MB台）

- [ ] 巨大PNG3枚を優先処理: `background3.png` 8MB・`nakamura_inside.png` 8.3MB・`tamakurou.png` 3.3MB → 表示サイズに合わせてリサイズ＋WebP化（JPEGフォールバック不要・全モダンブラウザ対応済み）
- [ ] `favicon.png` 565KB → 32〜180pxの適正サイズに（apple-touch-icon含め数KB台へ）
- [ ] 残りのJPEG群（300〜500KB台）を一括で品質80・幅1200px上限に再圧縮
- [ ] `2026schedule.pdf` 2.6MB → 画像化 or 圧縮（Ghostscript）を検討
- [ ] 全 `<img>` に `loading="lazy"`（ファーストビュー以外）と `width`/`height` 属性を付与（CLS対策）
- [ ] ツール: `sips`（macOS標準）＋ `cwebp`。元画像はOneDrive側に退避してからリポジトリ内は最適化版のみに

**検証**: 各ページの画像表示確認 ＋ index.html のLCP改善をLighthouseで確認。
**リスク: 低**（画質劣化だけ目視チェック）

---

## フェーズ 4：JS共通化（フォームの心臓部・最重要かつ最高リスク）

コピペJSを共有モジュールに集約する。**フォームは売上直結なので1フォームずつ**。

### 新設ファイル
```
js/
├── api.js          # API_BASE・DOMAIN_ORG_MAP・fetchラッパ・エラーハンドリング
├── classrooms.js   # /api/classrooms取得＋フォールバック＋開校日クランプ（現在4ページに重複）
├── lookup.js       # 生徒番号検索→フィールド有効化（現在5フォームに重複）
└── jugyo.js        # 教室選択→時刻プルダウン連動（現在6ページに重複）
```

### 手順
1. [ ] 4モジュールを新規作成（既存コードから最も新しい実装＝6e4f1ce の教室マスタ連動版をベースに抽出）
2. [ ] 移行順序（リスク低→高）:
   1. `form/kesseki.html`（欠席報告・在学生向けで流入少）
   2. `form/furikae.html` / `form/kentei.html` / `form/class-change.html` / `form/flash-anzan.html`
   3. `form/nyukai.html` / `form/taiken.html`
   4. **最後に** `trial.html` と `LP/trial.html`（広告CV直結・最重要）
3. [ ] 各フォーム移行ごとに: 本番相当の送信テスト（kintoneにテストレコード作成→確認→削除）→ コミット
4. [ ] trial系2ページは、フォーム部分のJSを共通化した上で**デザインの差分だけHTML側に残す**（フェーズ5の下準備）

### 注意点
- 挙動を変えない「移動だけ」に徹する。改善したい点が見つかってもこのフェーズではやらない（メモに残す）
- 各HTMLに残す固有部分: フォームのフィールド構成・バリデーション文言・送信先エンドポイント指定

**検証**: フォーム8種＋trial系2種の実送信テスト（チェックリスト参照）。
**リスク: 高**（申込導線の破壊 = 機会損失。1フォームずつ・即revert可能な粒度で）

---

## フェーズ 5：HTML重複の削減（判断が必要）

### 5-1. trial.html vs LP/trial.html（diff 2,157行）
フェーズ4でJSは共通化済み。残るHTML差分は「広告用LPは意図的にデザインが違う」ため**完全統合はしない**。
- [ ] フォーム部分（fieldset構造）だけ同一マークアップに揃え、以後の修正が機械的なコピペ1回で済む状態にする
- [ ] 両ページの先頭コメントに「相方ファイルと同期必須」の注記を入れる

### 5-2. 共通ヘッダー/フッター（ルート7ページで重複）
選択肢は3つ。**推奨は (a)**:
- **(a) 現状維持＋変更手順のドキュメント化**（推奨）: 静的サイトの規模（実質10ページ強）でビルドステップ導入はオーバーエンジニアリング。フッター変更は年数回
- (b) JSでの動的挿入: SEO・表示チラつきのリスクの割に得るものが少ない
- (c) 11ty等のSSG導入: 将来ページが30枚を超えたら再検討

### 5-3. `LP/campaign.html` / `LP/coupon.html`
- [x] 稼働終了を確認しフェーズ1で削除済み（2026-07-04）

**リスク: 低**（5-1のみ実マークアップ変更・要送信テスト）

---

## フェーズ 6：worker.js の整理（Cloudflare Workers）

999行・32関数の単一ファイル。**動作は安定しているので大手術はしない**。

- [ ] if連鎖のルーティングを `ROUTES` テーブル（メソッド×パス→ハンドラのマップ）に置換
- [ ] セクションコメントで区画整理: ユーティリティ / kintone共通 / 公開API / staff API
- [ ] トークン組み合わせルール（CLAUDE.md記載）を各ハンドラのコメントに転記（デプロイ事故防止）
- [ ] `wrangler deploy` → 全APIエンドポイントの疎通確認（GET系はcurl、POST系はフォーム送信テストで兼ねる）
- ES Modules分割は**やらない**（wranglerビルド構成の変更リスク > 可読性の利益）

**検証**: フォーム全種の送信テスト再実行。
**リスク: 中**（APIは全フォームの共通基盤。デプロイはフォーム利用の少ない時間帯に）

---

## フェーズ 7：計測とドキュメントの整合

- [ ] form/ 配下6フォーム＋staff/ にGTMスニペット追加（CLAUDE.mdルール準拠。在学生フォームの利用状況も見えるようになる）
- [ ] `sitemap.xml` を現状ページと同期
- [ ] CLAUDE.md を実態に合わせて全面更新:
  - ディレクトリ構成（削除済みファイルの除去・staff/ の追記）
  - 「CDNではなくCLIビルド」が**この時点で初めて真実になる**
  - Critical CSS記述の削除・JS共通モジュールの仕様追記
- [ ] AGENTS.md も同期
- [ ] Lighthouseで最終スコア計測 → フェーズ0の記録と比較して効果を数字で残す

---

## 実行順序とスケジュール目安

| フェーズ | 内容 | 目安工数 | リスク |
|---------|------|---------|--------|
| 0 | 安全網 | 30分 | なし |
| 1 | 死骸除去 | 1時間 | 低 |
| 2 | CSS一本化 | 2〜3時間 | 中 |
| 3 | 画像最適化 | 1〜2時間 | 低 |
| 4 | JS共通化 | 3〜4時間 | **高** |
| 5 | HTML重複削減 | 1時間 | 低 |
| 6 | worker.js整理 | 1〜2時間 | 中 |
| 7 | 計測・ドキュメント | 1時間 | なし |

- フェーズ1〜3だけでも「ユーザーに見える改善」（速度・事故防止）は完了する。4以降は保守性投資
- 各フェーズ完了ごとに main へ push（= 本番反映）して寝かせ、問題がないことを確認してから次へ
- **広告配信中のページ（index / LP/trial.html）に触るフェーズ2・4は、広告の配信時間帯を避けるか、CV数の監視をセットで**

---

## 付録：フォーム送信テストチェックリスト（フェーズ2・4・6の検証で使用）

| # | ページ | テスト内容 | 確認先 |
|---|--------|-----------|--------|
| 1 | trial.html | 教室3校の選択肢が出る・開校日前の日付が選べない・送信→trial-thanks.htmlへ遷移 | kintone App 17 |
| 2 | LP/trial.html | 同上・遷移先は LP/trial-thanks.html | App 17 |
| 3 | form/taiken.html | 同上 | App 17 |
| 4 | form/nyukai.html | 月謝コースが動的取得される・生徒番号が `要修正&乱数` で登録 | App 19 |
| 5 | form/kesseki.html | 欠席日→振替期日の自動計算・「未定」チェックで欄非表示・時刻が HH:MM:SS で登録 | App 14 |
| 6 | form/furikae.html | 生徒番号検索→チケット絞込→既存レコードUPDATE | App 14 |
| 7 | form/kentei.html | 生徒番号検索→送信 | App 12 |
| 8 | form/class-change.html | 生徒番号検索→送信 | App 18 |
| 9 | form/flash-anzan.html | 生徒番号検索→送信 | App 16 |
| 10 | 共通 | 週2コース生徒（A0001＋A0001-2）でlookupが複数レコードを返す | — |

テスト後は kintone のテストレコードを削除すること。
