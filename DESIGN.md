---
version: alpha
name: Rakutama-soroban-design
description: 練馬の子ども向けそろばん教室LPのデザインシステム。厚みのあるポップな立体感（下方向ハードシャドウの押し込みボタン、白フチの丸写真、吹き出しラベル）と、SVGの波で有機的につながる色帯セクションが軸。青緑(#4A96AE)を主役に、黄(#F59E0B)をCTA・強調に効かせる二色構成。Zen Kaku Gothic New の極太(900)見出しで親しみと元気さを出す。Apple的な引き算ではなく「明るく・賑やか・触れそう」を狙う足し算のデザイン。

colors:
  primary: "#4A96AE"
  primary-deep: "#2C7A94"
  secondary: "#F59E0B"
  secondary-shadow: "#B45309"
  secondary-strong: "#F5C800"
  success: "#22C55E"
  success-shadow: "#15803D"
  ink: "#374151"
  ink-strong: "#1F2937"
  ink-muted: "#6B7280"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  accent: "#E0F2F7"
  base: "#F7FBFA"
  canvas: "#ffffff"
  surface-cream: "#FFF9E6"
  surface-cream-2: "#FFFBEB"
  surface-amber-100: "#FEF3C7"
  surface-amber-200: "#FDE68A"
  surface-sky: "#dff0f5"
  surface-teal: "#4A96AE"
  surface-ink: "#1F2937"

typography:
  hero-display:
    fontFamily: "Zen Kaku Gothic New, sans-serif"
    fontSize: 36px
    fontWeight: 900
    lineHeight: 1.8
    letterSpacing: 0
  section-headline:
    fontFamily: "Zen Kaku Gothic New, sans-serif"
    fontSize: clamp(0.95rem, 4vw, 1.5rem)
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: 0
  card-title:
    fontFamily: "Zen Kaku Gothic New, sans-serif"
    fontSize: 18px
    fontWeight: 900
    lineHeight: 1.4
    letterSpacing: 0
  section-label:
    fontFamily: "Zen Kaku Gothic New, sans-serif"
    fontSize: 12.5px
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: 0.08em
  lead:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.9
    letterSpacing: 0
  body:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  button:
    fontFamily: "Zen Kaku Gothic New, sans-serif"
    fontSize: 16px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 0
  number:
    fontFamily: "Inter, sans-serif"
    fontSize: 38px
    fontWeight: 900
    lineHeight: 1.0
    letterSpacing: 0
  caption:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  card: 16px
  card-lg: 20px
  badge: 16px
  pill: 9999px
  circle: 50%

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 40px
  section-y: 40px
  container-x: 20px

shadow:
  soft: "0 4px 20px -2px rgba(74, 150, 174, 0.15)"
  photo: "0 4px 16px rgba(0, 0, 0, 0.13)"
  pop-button: "0 5px 0 rgba(0, 0, 0, 0.18)"
  pop-button-press: "0 2px 0 rgba(0, 0, 0, 0.18)"
  pop-badge: "0 4px 0 rgba(0, 0, 0, 0.18)"
  card-hover: "0 10px 28px rgba(74, 150, 174, 0.18)"

components:
  button-yellow:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
    shadow: "0 5px 0 {colors.secondary-shadow}"
  button-yellow-press:
    transform: "translateY(3px)"
    shadow: "0 2px 0 {colors.secondary-shadow}"
  button-green:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
    shadow: "0 5px 0 {colors.success-shadow}"
  button-white:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 32px
    shadow: "{shadow.pop-button}"
  section-label:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.section-label}"
    rounded: "{rounded.pill}"
    padding: 4px 24px 4px 20px
    border: "3px solid {colors.primary}"
    caret: "下向き三角 10px（{colors.primary}）"
  section-label-yellow:
    backgroundColor: "{colors.surface-cream}"
    textColor: "#B45309"
    border: "3px solid {colors.secondary}"
    caret: "下向き三角 10px（{colors.secondary}）"
  section-label-on-teal:
    backgroundColor: "{colors.surface-teal}"
    textColor: "{colors.on-dark}"
    border: "3px solid {colors.canvas}"
    caret: "下向き三角 10px（{colors.canvas}）"
  arrow-banner:
    backgroundColor: "{colors.secondary-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.section-headline}"
    clipPath: "polygon(0 0, 100% 0, calc(100% - 36px) 50%, 100% 100%, 0 100%)"
    padding: 16px 60px 16px 24px
    shadow: "0 4px 16px rgba(0,0,0,0.15)"
  pop-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card-lg}"
    border: "3px solid {colors.accent}"
    padding: 24px
  pop-card-hover:
    transform: "translateY(-4px)"
    shadow: "{shadow.card-hover}"
  feature-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: 24px
    shadow: "0 1px 2px rgba(0,0,0,0.05)"
  hero-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.badge}"
    padding: 12px 13px
    shadow: "{shadow.pop-badge}"
    iconChip: "28-36px 円 / {colors.secondary} 背景 / 白アイコン"
  circle-photo:
    rounded: "{rounded.circle}"
    border: "4px solid {colors.canvas}"
    shadow: "{shadow.photo}"
    objectFit: cover
  campaign-badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.section-label}"
    rounded: "{rounded.pill}"
    padding: 6px 16px
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    underline: "hover で下線が 0→100% に伸びる（{colors.primary}・2px）"
  section-wave:
    element: "SVG path（preserveAspectRatio=none・全幅）"
    fill: "遷移先セクションの背景色（{colors.surface-teal} / {colors.surface-cream} / {colors.surface-ink} / {colors.canvas}）"
    note: "隣接する2セクションの境目を波1枚で埋める。白の波を2枚重ねない"
---

## Overview

楽珠そろばん教室LPは、**厚みのある立体感とやわらかい有機的な形**で「明るく・親しみやすく・元気」を伝える、子ども＆保護者向けのデザイン。Appleが引き算（余白・単一アクセント・影ゼロ）で高級感を出すのとは真逆で、楽珠は**足し算**でにぎやかさと安心感を出す。

画面は縦に積まれた「色帯セクション」の連なりで、セクションどうしは**SVGの波**でつながる。波の `fill` に遷移先の色を入れることで、色の切り替わり＝セクションの区切りになる（Apple の「色変化そのものが仕切り」と同じ発想を、直線ではなく波で表現している）。主役は青緑 `{colors.primary}`、差し色に黄 `{colors.secondary}`。この二色でCTA・見出し・ラベルを回す。

立体感の作り方が最大の個性。ボタンやバッジは**下方向のハードシャドウ**（`0 5px 0` / `0 4px 0`＝ぼけない実線影）を持ち、押すと `translateY` で沈んで影が縮む——おもちゃのボタンを押した時の物理感。写真はすべて**白フチ4pxの円形**で切り抜き、賑やかに散らす。見出しは Zen Kaku Gothic New の**極太900**で、白い箱でハイライトして視認性を上げる。

**キャラクターを一言で:** Apple＝静かな美術館。楽珠＝明るい遊び場。

**Key Characteristics:**
- 青緑 `{colors.primary}` を主役、黄 `{colors.secondary}` を差し色にした二色運用。CTAは基本イエロー。
- セクションは全幅の色帯。境目は**波（SVG）**でつなぎ、波の色＝次のセクションの色。
- 立体は**下方向ハードシャドウ**で作る（`0 5px 0` 系）。ぼかし影はカード・写真にだけ、控えめに。
- 押し込みインタラクション（`:active` で `translateY(3px)` ＋ 影が `0 5px 0`→`0 2px 0`）が全ボタン共通。
- 見出しは Zen Kaku Gothic New 900、本文は Noto Sans JP、数字だけ Inter。
- 丸の多用：`{rounded.pill}`（ラベル・ボタン）と `{rounded.circle}`（写真）と `{rounded.card-lg}`（カード）。角ばりは避ける。
- 吹き出し風セクションラベル（白地＋色フチ＋下向き三角）で各セクションの頭を立てる。
- スクロールで下から16pxフェードイン（`.fade-in`）。

## Colors

### ブランド & アクセント
- **青緑 / Primary**（`{colors.primary}` — #4A96AE）：主役。ロゴ・見出し文字・枠線・ナビ下線・波の色。落ち着いたが親しみのあるトーン。
- **ディープ青緑**（`{colors.primary-deep}` — 目安 #2C7A94）：primary 上の押下・濃淡が要る箇所の参考値（tailwind の primary からの手動シェード）。
- **黄 / Secondary**（`{colors.secondary}` — #F59E0B）：CTAボタン・キャンペーンバッジ・バッジアイコン・強調ラベル。「押してほしい・目立たせたい」の合図。
- **黄シャドウ**（`{colors.secondary-shadow}` — #B45309）：イエローボタンのハードシャドウ／クリーム地の上の濃い黄文字。
- **濃い黄 / Strong**（`{colors.secondary-strong}` — #F5C800）：矢印バナー（`{component.arrow-banner}`）の面。彩度を上げてキーメッセージを張る。
- **緑 / Success**（`{colors.success}` — #22C55E、影 `{colors.success-shadow}` — #15803D）：LINE等ポジティブ動線のボタン。使用は限定的。

### サーフェス（色帯セクションの地色）
- **白**（`{colors.canvas}` — #ffffff）：基本の地。カード・バッジ・ラベルの面。
- **淡灰 / Base**（`{colors.base}` — #F7FBFA）／**淡青 / Accent**（`{colors.accent}` — #E0F2F7）：白に近い休符。カード枠（accent）や薄い地に。
- **クリーム**（`{colors.surface-cream}` — #FFF9E6 ／ 近縁 `#FFFBEB` `{colors.surface-amber-100}` #FEF3C7 `{colors.surface-amber-200}` #FDE68A）：黄系のやわらかいセクション地。温かさ担当。
- **水色**（`{colors.surface-sky}` — #dff0f5）：涼しげな淡水色セクション。
- **青緑ベタ**（`{colors.surface-teal}` — #4A96AE）：primary をそのまま全面に敷く強いセクション（非認知能力・CTA帯）。上のテキストは白。
- **濃紺グレー**（`{colors.surface-ink}` — #1F2937）：フッター等の締めの暗色。波 `fill="#1F2937"` で受ける。

### テキスト
- **本文インク**（`{colors.ink}` — #374151）：本文・大半の文字。純黒を避けたやわらかいグレー。
- **強調インク**（`{colors.ink-strong}` — #1F2937）：見出し・カードタイトルの濃い方。
- 明色地では上記グレー、青緑ベタ地・暗色地では**白**（`{colors.on-dark}`）。

### グラデーション
装飾グラデーションは基本使わない。奥行きは「色帯の切り替え」「波」「ハードシャドウ」で作る。ヒーローは写真背景（`Pictures/background3.webp` のフクロウ柄）＋うっすら光のにじみで、CSSグラデには依存しない。

## Typography

### フォントファミリー
- **見出し / Display**：`Zen Kaku Gothic New`（wght 500/700/**900**）。`.font-display` クラス。見出し・ラベル・ボタンは基本 **900（Black）**。丸みのある字形で親しみを出す。
- **本文 / UI**：`Noto Sans JP`（400/500/700）。`<body>` 既定。段落・説明文。
- **数字 / Number**：`Inter`（400/700）。`.font-number`。「01/02/03」の見出し番号や大きな数値のアクセントに限定使用。ラテン数字の抜けの良さ担当。

### 階層

| Token | Size | Weight | 用途 |
|---|---|---|---|
| `{typography.hero-display}` | ~36px（`text-4xl`） | 900 | ヒーローh1。白い箱でハイライト、行間 1.8 で箱を分離 |
| `{typography.section-headline}` | clamp(0.95–1.5rem) | 900 | 各セクションの見出し・矢印バナー |
| `{typography.card-title}` | 18px（`text-lg`） | 900 | カード見出し（中央寄せ） |
| `{typography.section-label}` | ~12.5px | 900 | 吹き出し風セクションラベル（`letter-spacing .08em`） |
| `{typography.lead}` | 16px | 500 | リード文（`leading-loose` 1.9 前後） |
| `{typography.body}` | 14px（`text-sm`） | 400 | 本文（`leading-relaxed`〜`loose`） |
| `{typography.button}` | 16px | 900 | ボタンラベル |
| `{typography.number}` | ~38px（`text-4xl`） | 900 | 番号・数値アクセント（Inter） |
| `{typography.caption}` | 12px | 400 | 注記・住所・小さめ補足 |

### 原則
- **見出しは Zen Kaku 900 が基準。** 中途半端な太さを使わず、極太で言い切る。楽珠の「元気さ」はこの太さが担う。
- **本文は Noto Sans JP、行間は広め**（1.7〜1.9）。子どもの習い事を検討する保護者が「読める」ペース。
- **数字だけ Inter。** 級・料金・番号などラテン数字はここで抜けを作る。和文フォントの数字と混ぜない。
- **白い箱ハイライト**：濃い背景・写真の上の見出しは、白い箱（`box-decoration-break: clone` で折返しても連続）で背後を抜き、可読性を確保する。
- 文字色は明色地 `{colors.ink}`、暗色/青緑地は白。純黒(#000)は使わない。

## Layout

### スペーシング
- **横パディング**：`{spacing.container-x}`（20px＝`px-5`）が全セクション共通の左右余白。
- **縦リズム**：セクション上は `pt-8`〜`pt-20`、下は `pb-0`（＝下端は**波**が受けるので余白ゼロ）。中身は `py-10`（`{spacing.section-y}` 40px 前後）が基準。
- **カード内**：24px（`p-6`）。
- **ボタン**：14px × 32px。

### コンテナ
- **最大幅**：ヒーロー `max-w-6xl`（~1152px）、標準セクション `max-w-5xl`（~1024px）、文章主体は `max-w-4xl`（~896px）。
- **グリッド**：特徴・教室・非認知は **3カラム**（`md:grid-cols-3`、モバイル1カラム）。ヒーローは **2カラム**（テキスト｜写真コラージュ）。
- **ガター**：カード間 20px（`gap-5`）前後。

### 余白の考え方
Apple ほど余白は取らない。要素はやや密に、でもカードの角丸と丸写真で圧迫感を逃がす。**波と丸**が「詰まってるのに窮屈じゃない」を成立させている。

## Elevation & Depth

| レベル | 表現 | 用途 |
|---|---|---|
| フラット | 影なし | 色帯セクションの地、波 |
| ソフト | `{shadow.soft}` / `{shadow.photo}` | カード・円写真のふわっとした浮き |
| **ポップ（ハード）** | `{shadow.pop-button}` `0 5px 0`／`{shadow.pop-badge}` `0 4px 0` | ボタン・ヒーローバッジ。**ぼけない実線の下影**で厚みを出す |
| 押下 | `{shadow.pop-button-press}` `0 2px 0` ＋ `translateY(3px)` | ボタン `:active`。沈んで影が縮む物理感 |
| ホバー浮上 | `translateY(-4〜-5px)` ＋ `{shadow.card-hover}` | カードのホバー |

**影の哲学。** 楽珠の立体感の主役は**下方向ハードシャドウ**（`0 Npx 0`＝blur無し）。これがおもちゃ的な厚み＝親しみやすさを生む。写真・カードにはソフトなぼかし影を控えめに添える。Apple が「影は製品写真に1つだけ」なのに対し、楽珠は「ハード影を積極的に使うが、色数と同じく用途を決めて乱用しない」。

## Shapes

### 角丸スケール

| Token | 値 | 用途 |
|---|---|---|
| `{rounded.none}` | 0px | 全幅の色帯・波 |
| `{rounded.card}` | 16px（`rounded-2xl`） | 一般カード・バッジ |
| `{rounded.card-lg}` | 20px | pop-card（3px枠つきカード） |
| `{rounded.pill}` | 9999px | ボタン・セクションラベル・キャンペーンバッジ |
| `{rounded.circle}` | 50% | 写真（circle-photo）・バッジアイコン・装飾丸 |

### 写真ジオメトリ
- **円形が基本**。`{component.circle-photo}`＝白フチ4px＋ソフト影で、大小を重ねてコラージュする（ヒーロー・教室紹介）。
- 角丸矩形写真は使うとしても控えめ。楽珠の写真は「丸くして散らす」が既定。

### 装飾
- **波（SVG）**：セクション境界。`preserveAspectRatio=none` で全幅に引き伸ばす。
- **矢印バナー**：`clip-path: polygon(...)` で右向き矢印形（`{component.arrow-banner}`）。キーメッセージを1本張る時に。
- **ドット背景**（`.dot-bg`）：白い水玉 `radial-gradient`、22px間隔。青緑ベタ地に軽い質感を足す。
- **装飾丸**：セクションに小さな半透明の円を散らして遊びを出す。

## Components

### ボタン（.btn-pop 系）
共通：`{rounded.pill}`・Zen Kaku 900・下ハードシャドウ・`:active` で沈む。padding 14×32。
- **イエロー**（`{component.button-yellow}`）：主CTA。「無料体験を申し込む」。`btn-shine` で光沢が流れる演出を足せる。
- **グリーン**（`{component.button-green}`）：LINE等の副動線。限定使用。
- **ホワイト**（`{component.button-white}`）：濃い地の上の副ボタン。文字は `{colors.primary}`。
> 主CTAは基本イエロー1択。1画面に主CTAを何個も置かない。

### セクションラベル（.sec-title）
白地＋3px色フチのpillに、下向きの三角（吹き出しの尻尾）。各セクションの頭に置く見出しの前フリ。
- 標準＝青緑フチ、`{component.section-label-yellow}`＝クリーム地の黄フチ、`{component.section-label-on-teal}`＝青緑ベタ地の白フチ。**背景セクションの色に合わせて3種を出し分ける。**

### カード
- **pop-card**（`{component.pop-card}`）：3px `{colors.accent}` フチ＋20px角丸。ホバーで浮上。
- **feature-card**：白・16px角丸・薄影。3カラムグリッドの中身（例：番号 `{typography.number}` ＋ タイトル ＋ 説明）。
- **circle-photo**：円形写真。

### ヒーロー
2カラム。左＝キャンペーンバッジ＋白箱ハイライトのh1＋リード＋CTA2つ＋実績バッジ3つ（`{component.hero-badge}`）。右＝円写真のコラージュ。背景はフクロウ柄画像。下端は波でつぎのセクション色へ。

### ナビ
白のスティッキーヘッダー（`sticky top-0`・下border＋薄影）。ロゴ＋テキストリンク（`{component.nav-link}`＝ホバー下線が伸びる）＋右端に黄CTA。モバイルはハンバーガー。

### 波（section-wave）
隣接セクションの境界を埋めるSVG。`fill` に**次のセクションの背景色**を入れる。
> **重要**：白の波を2枚連続させない（＝白帯が浮く）。セクションを削除・並べ替えたら、境界の波は必ず「上のセクションから下のセクションの色へ」1枚で通す。

## Do's and Don'ts

### Do
- CTAは黄 `{colors.secondary}`、主役の面・文字・枠は青緑 `{colors.primary}`。この二色で回す。
- ボタン・バッジは下ハードシャドウ（`0 5px 0` / `0 4px 0`）＋ `:active` で `translateY` 沈み込み。厚みと押し心地をセットで。
- 見出し・ラベル・ボタンは Zen Kaku Gothic New **900**。本文は Noto Sans JP、数字は Inter。
- セクションの境目は**波**でつなぎ、波の色＝次のセクションの色。
- 写真は円形＋白フチ4pxで散らす。
- 濃い地・写真上の見出しは白い箱でハイライトして可読性を確保。
- セクションラベルは背景色に合わせて3バリアント（青緑／黄／青緑地の白）を出し分ける。

### Don't
- 白の波を2枚重ねない（境界に白帯が浮く。セクション削除時に起きやすい——本ファイル整備のきっかけになった不具合）。
- CTAを増やしすぎない。主CTA（黄）は1画面1つを基本に。
- ハードシャドウをカード全部・見出しにまで乱用しない（厚みが渋滞する）。効かせどころはボタン・バッジ。
- 純黒（#000）で文字を置かない。`{colors.ink}` #374151 を使う。
- 見出しに細いウェイトを使わない。楽珠の元気さは900の太さが担う。
- 装飾グラデーションで奥行きを作らない。奥行きは色帯・波・ハード影で。
- 角ばった直線的なUIにしない。pill・円・角丸・波で有機的にまとめる。

## Responsive

- **ブレークポイント**：Tailwind 既定。実質 `md`(768px) が主分岐——ヒーロー/グリッドが2〜3カラム↔1カラム、バッジやアイコンのサイズ切替（例：`{component.hero-badge}` のアイコンチップ 28px→36px、縦積み→横並び）。
- **ヒーロー**：`md` 未満はテキスト→写真コラージュの縦積み。h1 は白箱ごと折返し（`box-decoration-break: clone`）。
- **グリッド**：3カラム→1カラム。カードは全幅。
- **見出し**：`clamp()` でビューポート幅に追従（`{typography.section-headline}`）。
- **横スクロール禁止**：`body { overflow-x: hidden }`。波・装飾丸がはみ出しても横スクロールを出さない。
- **タッチターゲット**：CTA・バッジは指で押せるサイズ（14×32 padding のpillは実効ヒット領域が広い）。

## 実装メモ（このリポジトリ固有）

- 色・フォント・soft影は `tailwind.config.js` に定義（`primary/secondary/accent/base/text`・`font-display/number`・`shadow-soft`）。**色を足す時はまずここ**。
- ポップ系の見た目（`.btn-pop` `.sec-title` `.pop-card` `.badge-hero` `.circle-photo` `.wave-bottom` `.fade-in` など）は各HTMLの `<style>` にベタ書き（Tailwind の外）。トークン化するならこの層を config か共通CSSへ寄せるのが次の一歩。
- クラスを足したら `npm run build:css` で `tailwind.css` を再生成（`tailwind.css` は直接編集しない）。
- 全ページ共通の見た目は本ファイルを基準に。ページ個別の逸脱を足す前に「既存トークンで表現できないか」を先に見る。
