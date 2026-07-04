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

## フェーズ 2：CSS一本化（CDN Tailwind → CLIビルド）★効果最大（✅ 2026-07-04 完了）

19ページ（Phase1でLP4枚削除済みのため21→19）の CDN Tailwind をビルド済み `tailwind.css` に置き換えた。

**実施結果**:
- 全19ページから CDN JITコンパイラ（約110KBのブロッキングJS）＋インラインconfigを除去し、`/tailwind.css`（51KB・全ページ共有キャッシュ）への参照に置換
- form系configの `primary`(#22C55E) 衝突は form/schedule.html の6トークンのみ → 同一hexの `green-500` に置換（accent使用は0件）。他のformページは元からリテラル色クラス使用で無影響
- `text-base` の色名衝突はビルド版でもfont-sizeに解決されることを実ビルドで検証済み
- 全ページ×全クラスのカバレッジを機械検証（JS動的クラス・arbitrary value含め漏れ0）
- ローカル目視＋computed style検証（#4A96AE / #22C55E 完全一致）→ 3コミット（6ba06bf/977fed0/2f688fa）で本番反映・全19ページの配信内容をcurl検証済み

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

## フェーズ 3：画像最適化（✅ 2026-07-04 完了：26MB → 3.6MB）

- [x] 巨大画像をWebP化＋リサイズ: `background3.png` 7.6MB→64KB（1920w）、`nakamura_inside.png` 7.9MB→100KB（1200h）※`tamakurou.png` はPhase1で削除済み
- [x] `favicon.png` 552KB→29KB（180px・ファイル名維持のためHTML26ファイル無修正）
- [x] JPEG群18枚を表示サイズ基準でWebP化（講師写真は最大128px表示→512wで各20〜28KB、School写真900w、商品写真は等倍）
- [x] `hayamiya_inside.jpg` は中身が既にWebPだった（拡張子詐称）→ .webpに正規化
- [x] ロゴ（title.png）・ヒーロー（fetchpriority付きfv）を除く32箇所に `loading="lazy" decoding="async"` 付与
- [ ] `2026schedule.pdf` 2.6MB → Ghostscript未インストールのため見送り（リンク先文書でページ表示速度に影響なし。気になったら `brew install ghostscript` 後に圧縮）
- 元画像は git 履歴（`pre-refactor-20260704`）に全て保持。OneDrive退避は不要と判断

**検証結果**: 全ページ `naturalWidth` チェックで破損0・本番WebP配信curl確認済み。index.html の画像総重量は約10MB→約0.7MB
**メモ**: og:image / twitter:image が全ページ未設定（SNSシェア時にサムネが出ない）。リファクタとは別の改善候補

---

## フェーズ 4：JS共通化（フォームの心臓部・最重要かつ最高リスク）（✅ 2026-07-04 完了）

コピペJSを共有モジュール2ファイルに集約した。約1,269行削除／66行追加。

### 新設ファイル（当初計画の4分割 → 2ファイルに統合）
```
js/
├── form-common.js   # API_BASE・DOMAIN_ORG_MAP/ORG_CODE・loadClassroomsInto()・
│                    #   loadTimeSlotsInto()・setupStudentLookup()（在学生6フォーム＋nyukai/taikenが利用）
└── trial-schedule.js # 休講日/臨時開講日/教室別開講曜日/希望日時プルダウン生成・initTrialSchedule()
                      #   （trial.html / LP/trial.html / form/taiken.html が利用）
```
> 当初は api/classrooms/lookup/jugyo の4分割案だったが、実際の依存関係（生徒検索＋教室連動は必ずセット、trial系の日程ロジックは独立性が高い）に合わせて2ファイルに統合したほうが読みやすいと判断。

### 実施結果
- **在学生6フォーム**（kesseki/furikae/kentei/class-change/flash-anzan/nyukai）→ form-common.js（コミット d10cf2b）
- **体験申込3ページ**（trial/LP-trial/taiken）→ form-common.js + trial-schedule.js（コミット 5222532）
- ページ固有部分（送信ペイロード・バリデーション文言・fbq/GTM計測・アコーディオン等）は各HTMLに温存
- ページ差分は `initTrialSchedule({classroomSelectId, minDateMode})` のパラメータ化で吸収（trial.htmlは翌日18時ルール・他は当日から／LP版のセレクタIDは`classroom-select`）

### ついでに直したバグ（移行中に発見）
- **class-change.html / flash-anzan.html**: 生徒検索後に旧レスポンス形式（`s.classroom`・`s.jugyoIds` 直下）を参照しており、`/api/lookup` が返す `records[]` 形式と噛み合わず教室・クラス表示と送信データが欠落していた → records[]ベースに統一して修正
- **nyukai.html**: `DOMAIN_ORG_MAP` に `amayira.github.io` が欠けていたドリフト → 共通化で解消

### 検証（本番 rakutama-tokyo.com で実施）
- 共有JS 2本が200配信・全9ページが参照することをcurl確認
- trial.html（最高リスク・広告CV）：モジュール読込→教室選択→開講バッジ→希望日程→時刻連動を実ブラウザで確認。送信ハンドラは fetch を差し替えて**kintone未到達のまま**成功パスを走らせ、trial-thanks（CVページ）へのリダイレクトと、送信ペイロード（氏名・学年・教室・希望日時マージ）が正しいことを確認 → **実レコードは書き込んでいない**
- 在学生フォーム：ローカルで生徒検索の配線・リセット/プリセット・検定費連動・変更種別の欄切替を確認
- ※実際のkintone書き込みテストは自動化ガードでブロックされたため未実施。次回、有山さんが手元で1件ずつ送信→レコード確認→削除するのが確実

**リスク: 高**（申込導線）→ 挙動不変の移動に徹したため実質低。3コミット構成で部分revert可

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
