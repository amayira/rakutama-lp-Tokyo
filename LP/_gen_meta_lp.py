#!/usr/bin/env python3
"""Meta広告用 校別LP（HAYASHI LP と同構成）を生成する。
使い方: python3 LP/_gen_meta_lp.py .  （リポジトリ直下で実行）
"""
import sys, html
from pathlib import Path

ROOT = Path(sys.argv[1])

SCHOOLS = [
    dict(
        slug='fujimidai', name='富士見台校', area='富士見台', station_short='富士見台駅',
        walk='5', line='西武池袋線「富士見台駅」徒歩5分',
        zip='〒177-0034', address='東京都練馬区富士見台2-19-14 アーバン・スクエア201号室（らら・まんま内）',
        map_q='東京都練馬区富士見台2-19-14',
        map_url='https://maps.app.goo.gl/tKsMjiurWuXmFWx2A',
        days=[('火曜日', '16:00〜16:55／17:00〜17:55'), ('木曜日', '16:00〜16:55／17:00〜17:55')],
        days_short='火・木',
        schools_near='石神井東小 徒歩5分／南が丘小 徒歩12分',
        inside='fujimidai_inside.webp', outside='fujimidai_outside.webp',
        teacher='トンプソン 京子', teacher_img='thompson_fujimidai.webp',
        teacher_msg='カナダで保育士として働いていた経験から、子ども一人ひとりの個性やペースを大切にする関わり方を心がけています。双子の息子を育てる母として、「できた」の瞬間に立ち会える喜びを大切にしています。',
        place_note='子育てコミュニティスペース「らら・まんま」内の、あたたかい雰囲気の教室です。',
    ),
    dict(
        slug='tobunerima', name='東武練馬校', area='東武練馬', station_short='東武練馬駅',
        walk='2', line='東武東上線「東武練馬駅」徒歩2分',
        zip='〒179-0081', address='東京都練馬区北町2-37-9 サンポービル2階（D-Base東武練馬店内）',
        map_q='東京都練馬区北町2-37-9',
        map_url='https://maps.app.goo.gl/brHziqyFfittkgCq6',
        days=[('火曜日', '16:15〜17:10／17:15〜18:10'), ('金曜日', '16:15〜17:10／17:15〜18:10')],
        days_short='火・金',
        schools_near='北町小 徒歩7分／北野小（板橋区） 徒歩8分',
        inside='tobunerima_inside.webp', outside='tobunerima_outside.webp',
        teacher='成田 幸子', teacher_img='narita_tobunerima.webp',
        teacher_msg='保育園で働いてきた経験を活かし、一人ひとりのペースを大切にしながら、集中力と自信を育てる教室をつくっていきます。',
        place_note='東武練馬駅からすぐの駅チカ教室。お仕事帰りのお迎えにも便利です。',
    ),
]

PIXEL_ID = '26309460622081386'

TEMPLATE = r'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5K7GZCTN');</script>
<!-- End Google Tag Manager -->
<!-- Meta Pixel（広告クリックの紐づけ用 PageView。Lead は trial-thanks で発火） -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','__PIXEL__');
fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=__PIXEL__&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>【無料体験】楽珠そろばん教室 __NAME__｜__STATION__ 徒歩__WALK__分</title>
<meta name="description" content="__AREA__エリアのそろばん教室。年中さんから通えます。無料体験受付中、体験当日のお手続きで入会金無料。">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/Pictures/favicon.png">
<link rel="preload" as="image" href="/Pictures/fv.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&display=swap" rel="stylesheet">
<style>
:root{--pink:#E1497A;--pink-d:#c73565;--yellow:#FFE34D;--cream:#FFF7C2;--sky:#5BB8D6;--teal:#4A96AE;--teal-d:#2f7891;--green:#8CCB4E;--ink:#3a3a3a;--blush:#FCE6EC}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:"M PLUS Rounded 1c",-apple-system,"Hiragino Maru Gothic ProN","Hiragino Sans",sans-serif;color:var(--ink);background:#fff;line-height:1.7;padding-bottom:84px}
img{max-width:100%;height:auto;display:block}
.wrap{max-width:480px;margin:0 auto;overflow:hidden}
.hidden{display:none!important}
.r{font-weight:800}
/* header */
.hd{display:flex;align-items:center;justify-content:space-between;padding:10px 14px 8px;background:#fff}
.hd-l{display:flex;flex-direction:column;gap:3px}
.hd-l img{height:30px;width:auto}
.hd-tag{display:inline-block;background:#3a3a3a;color:#fff;font-weight:800;font-size:12px;border-radius:6px;padding:1px 10px;width:max-content}
.walk{width:72px;height:72px;border-radius:50%;background:var(--sky);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;font-size:11px;line-height:1.25;text-align:center;box-shadow:0 0 0 3px #fff,0 0 0 5px var(--sky)}
.walk b{font-size:15px}
/* MV */
.mv{position:relative;background:linear-gradient(#fff 0,#fff 30%,#eaf6fb 30%)}
.mv-catch{text-align:center;padding:4px 10px 10px;position:relative;z-index:2}
.mv-catch p{color:var(--pink);font-weight:800;font-size:23px;line-height:1.35;text-shadow:2px 0 #fff,-2px 0 #fff,0 2px #fff,0 -2px #fff}
.mv-catch p small{font-size:17px}
.mv-catch .big{font-size:52px;line-height:1.15;letter-spacing:.02em;text-shadow:3px 3px 0 #fff,-3px 3px 0 #fff,3px -3px 0 #fff,-3px -3px 0 #fff,0 6px 0 rgba(225,73,122,.18)}
.mv-photo{position:relative}
.mv-photo img{width:100%;aspect-ratio:4/3;object-fit:cover}
.mv-hand{position:absolute;right:10px;bottom:14px;color:var(--yellow);font-weight:800;font-size:21px;line-height:1.3;text-align:right;transform:rotate(-5deg);text-shadow:2px 2px 0 var(--pink),-1px -1px 0 var(--pink),1px -1px 0 var(--pink),-1px 1px 0 var(--pink)}
.mv-ribbons{background:var(--yellow);padding:12px 10px 16px;display:flex;flex-direction:column;align-items:flex-start;gap:6px;transform:skewY(-2deg);margin-top:-10px;position:relative;z-index:2}
.ribbon{background:var(--pink);color:#fff;font-weight:800;font-size:14px;padding:3px 10px;transform:skewY(2deg)}
.ribbon em{font-style:normal;color:var(--yellow)}
.ribbon:nth-child(2){margin-left:auto}
/* buttons */
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:86%;max-width:360px;margin:0 auto;background:var(--pink);color:#fff;text-decoration:none;font-weight:800;font-size:19px;padding:13px 10px;border-radius:999px;border:3px solid #fff;box-shadow:0 4px 0 var(--pink-d),0 0 0 2px var(--pink)}
.btn i{width:28px;height:28px;border-radius:50%;background:#fff;color:var(--pink);display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:16px}
.btn-band{background:var(--sky);padding:18px 0 20px}
.fixed-cta{position:fixed;left:0;right:0;bottom:0;z-index:50;background:rgba(91,184,214,.95);padding:10px 0 calc(10px + env(safe-area-inset-bottom))}
.fixed-cta .btn{font-size:18px;padding:10px}
/* month event */
.ev{background:var(--yellow);padding:22px 0 0;text-align:center}
.ev-g{background:var(--green);margin-top:18px;padding:14px 12px 20px}
.ev-ttl{font-weight:800;font-size:44px;line-height:1.1;letter-spacing:.02em}
.ev-ttl .m{display:inline-block;background:var(--pink);color:#fff;font-size:22px;border-radius:999px;padding:2px 12px;vertical-align:middle;margin-right:4px}
.ev-ttl .c1{color:#F28C28}.ev-ttl .c2{color:var(--sky)}.ev-ttl .c3{color:var(--pink)}.ev-ttl .c4{color:#6DBE45}
.ev-ttl span{text-shadow:3px 3px 0 #fff,-3px 3px 0 #fff,3px -3px 0 #fff,-3px -3px 0 #fff}
.ev-ttl .m,.ev-ttl .m span{text-shadow:none}
.ev-sub{color:#fff;font-weight:800;font-size:18px;margin:0 0 12px;text-shadow:0 2px 0 rgba(0,0,0,.12)}
.ev-note{font-size:11px;color:#3a3a3a;margin-top:12px}
/* trial card */
.tr{background:#F1F7C9;padding:34px 18px 26px;position:relative}
.pin{position:absolute;top:-18px;left:50%;transform:translateX(-50%);width:62px;height:62px;border-radius:50%;background:var(--pink);color:#fff;font-weight:800;text-align:center;line-height:1.05;padding-top:10px;font-size:11px}
.pin b{display:block;font-size:24px}
.tr h3{text-align:center;font-weight:800;font-size:21px;margin:14px 0 18px}
.tr h3 span{background:linear-gradient(transparent 60%,rgba(225,73,122,.3) 60%)}
.kv{display:flex;align-items:center;gap:12px;margin:10px 0}
.kv .k{flex:none;border:2px solid var(--pink);color:var(--pink);background:#fff;border-radius:999px;font-size:13px;font-weight:800;padding:1px 12px}
.kv .v{font-weight:800;font-size:16px}
.kv .price{color:var(--pink);font-size:54px;line-height:1}
.kv .price small{font-size:30px}
.kv .tax{font-size:12px;color:#555;align-self:flex-end}
.tr-note{font-size:12px;color:#555;text-align:center;margin-top:8px}
/* join campaign */
.join-head{text-align:center;font-weight:800;font-size:27px;line-height:1.4;padding:26px 10px 18px}
.cp{background:var(--yellow);padding:24px 16px 28px;text-align:center}
.cp-ttl{color:var(--sky);font-weight:800;font-size:30px;text-shadow:2px 2px 0 #fff,-2px 2px 0 #fff,2px -2px 0 #fff,-2px -2px 0 #fff}
.cp-pill{display:inline-block;background:#fff;border:2px solid var(--pink);color:var(--pink);font-weight:800;font-size:17px;border-radius:999px;padding:3px 18px;margin:8px 0 16px}
.cp-pill b{font-size:23px;border-bottom:3px wavy var(--pink)}
.cp-row{background:var(--pink);color:#fff;border-radius:16px;display:flex;align-items:center;justify-content:space-between;padding:12px 18px;margin:10px 0;text-align:left;box-shadow:0 4px 0 var(--pink-d)}
.cp-row .l{font-weight:800;font-size:21px;line-height:1.2}
.cp-row .l small{display:block;font-size:11px;font-weight:700;opacity:.95}
.cp-row .v{color:var(--yellow);font-weight:800;font-size:46px;line-height:1}
.cp-row .v small{font-size:26px}
.cp-row .v s{color:#fff;font-size:14px;opacity:.8;margin-right:4px}
.cp-note{font-size:11px;margin-top:8px}
/* form */
.fm{background:var(--cream);padding:30px 14px 34px}
.fm-card{background:#fff;border-radius:22px;padding:22px 16px;box-shadow:0 6px 0 rgba(0,0,0,.06)}
.badge{display:block;width:max-content;margin:0 auto 8px;background:var(--pink);color:#fff;font-weight:800;font-size:14px;border-radius:999px;padding:3px 16px}
.fm h2{text-align:center;color:var(--teal-d);font-weight:800;font-size:24px;line-height:1.35;margin-bottom:4px}
.fm-sub{text-align:center;font-size:13px;margin-bottom:18px}
.fld{margin-bottom:16px}
.fld label,.fld .lb{display:block;font-weight:800;font-size:14px;margin-bottom:6px}
.req{color:#fff;background:var(--pink);font-size:10px;border-radius:4px;padding:1px 5px;margin-left:6px;vertical-align:2px}
.opt{color:#888;font-size:11px;margin-left:6px}
.field{width:100%;border:2px solid #e3e3e3;border-radius:12px;padding:11px 12px;font-size:16px;font-family:inherit;background:#fff;color:var(--ink)}
.field:focus{outline:none;border-color:var(--sky)}
.pref{background:#F4FAFC;border-radius:14px;padding:10px 12px;margin-bottom:8px}
.pref p{font-weight:800;font-size:13px;color:var(--teal-d);margin-bottom:6px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.radios{display:flex;gap:22px;font-size:15px}
.err{background:#fdecef;border:2px solid var(--pink);color:var(--pink-d);border-radius:12px;padding:10px 12px;font-size:13px;font-weight:700;margin-bottom:14px}
#schedule-list span{display:inline-block;background:#eaf6fb;color:var(--teal-d);font-size:12px;border-radius:999px;padding:2px 10px;margin:0 4px 4px 0}
#schedule-section{margin-bottom:12px;font-size:12px}
.submit{width:100%;border:none;cursor:pointer;font-family:inherit;margin-top:6px}
.spin{display:inline-block;width:18px;height:18px;border:3px solid rgba(255,255,255,.5);border-top-color:#fff;border-radius:50%;animation:sp .8s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.fm-foot{font-size:12px;text-align:center;color:#666;margin-top:12px}
/* concept */
.cn{position:relative;background:var(--sky);color:#fff;text-align:center;padding:26px 18px 30px}
.cn-pill{display:inline-block;background:var(--pink);border-radius:999px;font-weight:800;font-size:14px;padding:3px 16px;margin-bottom:8px}
.cn-big{font-weight:800;font-size:46px;line-height:1.15;color:var(--yellow);text-shadow:3px 3px 0 var(--teal-d),-2px -2px 0 var(--teal-d),2px -2px 0 var(--teal-d),-2px 2px 0 var(--teal-d)}
.cn-text{font-size:13px;margin:16px 0 18px;line-height:2}
.cn img{border-radius:18px;border:4px solid #fff}
.st{background:var(--cream);text-align:center;padding:30px 14px 32px}
.st p{font-weight:800;font-size:17px;line-height:2}
.st-rb{display:inline-block;background:var(--teal);color:#fff;font-weight:800;font-size:21px;line-height:1.5;padding:6px 14px;margin-top:16px;transform:rotate(-3deg)}
.st-rb + .st-rb{transform:rotate(-3deg) translateX(14px);margin-top:4px}
/* features */
.ft{background:var(--cream);padding:6px 14px 30px}
.sec-ttl{text-align:center;font-weight:800;font-size:22px;margin:4px 0 18px}
.sec-ttl::before{content:"💡";display:block;font-size:22px}
.fc{background:#fff;border-radius:24px;padding:22px 16px;margin-bottom:16px;text-align:center}
.fc .no{font-weight:800;font-size:40px;color:var(--sky);line-height:1}
.fc h3{font-weight:800;font-size:23px;color:var(--teal-d);line-height:1.35;margin:4px 0 14px}
.fc img{border-radius:12px;width:100%;aspect-ratio:16/10;object-fit:cover}
.fc .cap{display:inline-block;background:var(--teal);color:#fff;font-weight:800;font-size:13px;padding:3px 10px;margin:12px 0 0;transform:rotate(-2deg)}
.fc p{font-size:13.5px;text-align:left;margin-top:12px;line-height:1.85}
.fc mark{background:linear-gradient(transparent 55%,var(--yellow) 55%);font-weight:800}
.pg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.pg div{background:#eaf6fb;border-radius:14px;padding:10px 8px;text-align:center}
.pg b{display:block;color:var(--teal-d);font-size:15px}
.pg small{font-size:11px;color:#555;line-height:1.5;display:block}
/* teacher */
.th{padding:30px 14px 26px;text-align:center}
.circle{width:86px;height:86px;border-radius:50%;background:var(--yellow);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;line-height:1.3;box-shadow:0 0 0 6px #FFF3A6}
.th h2,.cl h2{color:var(--sky);font-weight:800;font-size:22px;line-height:1.45;margin-bottom:18px}
.tc{background:#FFF0A8;border-radius:28px;padding:18px 16px;display:flex;gap:14px;align-items:flex-start;text-align:left}
.tc img{width:110px;height:130px;object-fit:cover;border-radius:16px;flex:none}
.tc .nm{font-weight:800;font-size:19px}
.tc .nm small{display:block;font-size:11px;color:#777}
.tc p{font-size:13px;line-height:1.8;margin-top:6px}
/* class */
.cl{background:var(--yellow);padding:30px 14px 30px;text-align:center}
.cl .circle{background:#fff;box-shadow:0 0 0 6px rgba(255,255,255,.5)}
.cc{background:#fff;border-radius:24px;padding:18px 16px;text-align:left;margin-bottom:14px}
.cc-h{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid var(--pink);padding-bottom:6px;margin-bottom:12px}
.cc-h b{color:var(--pink);font-size:20px}
.cc-h span{background:var(--pink);color:#fff;font-size:12px;font-weight:800;border-radius:6px;padding:1px 10px}
.cc-lead{text-align:center;font-weight:800;font-size:15px;margin-bottom:12px}
.cc-row{display:flex;gap:12px;align-items:center}
.cc-row img{width:120px;height:120px;border-radius:50%;object-fit:cover;flex:none}
.cc-time .t{background:var(--pink);color:#fff;font-weight:800;font-size:12px;text-align:center;border-radius:4px;padding:1px 0;margin-bottom:6px}
.cc-time p{font-size:13px;font-weight:700;line-height:1.7}
.fee{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
.fee div{text-align:center}
.fee .t{background:var(--pink);color:#fff;font-weight:800;font-size:12px;border-radius:4px;padding:1px 0}
.fee b{display:block;font-size:24px;margin-top:2px}
.fee b small{font-size:13px}
.fee-note{font-size:11px;color:#666;margin-top:8px}
/* method */
.md{background:#eaf6fb;padding:28px 14px 30px}
.md .en{text-align:center;color:var(--sky);font-weight:800;letter-spacing:.2em;font-size:13px}
.md h2{text-align:center;font-weight:800;font-size:22px;margin-bottom:12px}
.md-card{background:#fff;border-radius:22px;padding:18px 16px}
.md-card p{font-size:13.5px;line-height:1.9}
.md-list{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.md-list div{border-left:6px solid var(--sky);background:#F4FAFC;border-radius:6px;padding:8px 10px;font-size:13px}
.md-list b{display:block;color:var(--teal-d);font-size:15px}
/* access */
.ac{background:#efefef;padding:26px 14px 24px;text-align:center}
.ac .en{font-weight:800;letter-spacing:.2em;font-size:15px;margin-bottom:6px}
.ac-name{font-weight:800;font-size:18px;margin-bottom:10px}
.ac-row{display:flex;align-items:center;gap:12px;text-align:left;margin:10px 0 14px}
.ac-row p{font-size:13px;line-height:1.7;flex:1}
.ac-row p b{font-size:14px}
.ac iframe{width:100%;height:240px;border:0;border-radius:6px}
.ac-info{text-align:left;font-size:13px;margin-top:12px;line-height:1.9}
.ac-links{display:flex;gap:8px;margin-top:14px}
.ac-links a{flex:1;display:block;text-align:center;background:var(--teal);color:#fff;font-weight:800;text-decoration:none;border-radius:8px;padding:10px 0;font-size:14px}
.ac-links a.line{background:#06C755}
.ft-copy{text-align:center;font-size:11px;color:#888;padding:14px 0 6px}
.ft-copy a{color:#888}
</style>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5K7GZCTN" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div class="wrap">

<!-- ヘッダー -->
<header class="hd">
  <div class="hd-l">
    <img src="/Pictures/title.png" alt="楽珠そろばん教室" width="200" height="30">
    <span class="hd-tag">__NAME__</span>
  </div>
  <div class="walk">__STATION__<br>より<br><b>徒歩__WALK__分</b></div>
</header>

<!-- MV -->
<section class="mv">
  <div class="mv-catch">
    <p>計算が苦手なお子さまと<br><small>算数に自信がない</small>お子さまが</p>
    <p class="big">主役です！</p>
  </div>
  <div class="mv-photo">
    <img src="/Pictures/fv.webp" alt="そろばんを弾く男の子" width="1200" height="900" fetchpriority="high">
    <p class="mv-hand">お子さまのチャレンジを<br>応援します！</p>
  </div>
  <div class="mv-ribbons">
    <span class="ribbon">集中力と計算力を楽しく伸ばす</span>
    <span class="ribbon"><em>楽珠そろばん</em>の指導をぜひ、お試しください！</span>
  </div>
</section>

<!-- 月の無料体験会 -->
<section class="ev">
  <p class="ev-ttl"><span class="m"><span class="js-month">11</span>月</span><span class="c1">無</span><span class="c2">料</span><span class="c3">体</span><span class="c4">験</span><span class="c1">会</span></p>
  <div class="ev-g">
    <p class="ev-sub">各コマ限定5名・定員になり次第受付終了！</p>
    <a href="#form" class="btn">体験日はコチラ <i>➜</i></a>
  </div>
</section>

<!-- 体験の内容 -->
<section class="tr">
  <div class="pin">体験<b>01</b></div>
  <h3><span>年中〜小学生 そろばん無料体験</span></h3>
  <div class="kv"><span class="k">対象</span><span class="v">年中〜小学6年生（数字が書ければOK）</span></div>
  <div class="kv"><span class="k">体験料</span><span class="v price">0<small>円</small></span><span class="tax">約30分・持ち物不要</span></div>
  <div class="kv"><span class="k">開催日</span><span class="v">毎週__DAYS_SHORT__曜日の授業時間内</span></div>
  <p class="tr-note">体験で使ったテキストはそのままお持ち帰りいただけます</p>
</section>
<div class="btn-band"><a href="#form" class="btn">体験日はコチラから <i>➜</i></a></div>

<!-- 特別入会キャンペーン -->
<p class="join-head">教室が気に入ったら<br>ぜひご入会ください！！</p>
<section class="cp">
  <p class="cp-ttl">特別入会キャンペーン！</p>
  <p class="cp-pill">体験<b>当日</b>の入会限定で！</p>
  <div class="cp-row"><span class="l">入会金<small>税込5,500円</small></span><span class="v"><small>¥</small>0</span></div>
  <div class="cp-row"><span class="l">初期費用<small>入会金・登録料・教材費</small></span><span class="v"><s>9,900円</s>4,400<small>円</small></span></div>
  <p class="cp-note">※そろばん経験者の方は初期教材費（3,300円）が不要です。</p>
</section>

<!-- 申込フォーム -->
<section class="fm" id="form">
  <div class="fm-card">
    <span class="badge">各コマ限定5名</span>
    <h2>無料体験のお申し込み</h2>
    <p class="fm-sub">__NAME__（__STATION__ 徒歩__WALK__分）</p>

    <div id="error-box" class="err hidden"></div>

    <form id="taiken-form" novalidate>
      <div class="hidden"><select id="classroom" disabled><option>__NAME__</option></select></div>

      <div id="schedule-section" class="hidden">
        <div id="schedule-spinner" class="hidden">読み込み中...</div>
        <div id="schedule-list"></div>
      </div>

      <div class="fld">
        <span class="lb">体験希望日時<span class="req">必須</span></span>
        <div class="pref"><p>第1希望</p><div class="grid2">
          <select id="pref1-date" required class="field" aria-label="第1希望 日付"><option value="">日付</option></select>
          <select id="pref1-time" required class="field" aria-label="第1希望 時間"><option value="">時間</option></select>
        </div></div>
        <div class="pref"><p>第2希望</p><div class="grid2">
          <select id="pref2-date" required class="field" aria-label="第2希望 日付"><option value="">日付</option></select>
          <select id="pref2-time" required class="field" aria-label="第2希望 時間"><option value="">時間</option></select>
        </div></div>
      </div>

      <div class="fld">
        <span class="lb">お子さまのお名前<span class="req">必須</span></span>
        <div class="grid2">
          <input type="text" id="family-name" placeholder="姓" autocomplete="family-name" required class="field">
          <input type="text" id="given-name" placeholder="名" required class="field">
        </div>
      </div>

      <div class="fld">
        <label for="grade">学年</label>
        <select id="grade" class="field">
          <option value="">選択してください</option>
          <option>年少</option><option>年中</option><option>年長</option>
          <option>小1</option><option>小2</option><option>小3</option>
          <option>小4</option><option>小5</option><option>小6</option>
          <option>中1</option><option>中2</option><option>中3</option>
          <option>その他</option>
        </select>
      </div>

      <div class="fld">
        <span class="lb">そろばん経験</span>
        <div class="radios">
          <label><input type="radio" name="experience" value="なし" checked> なし</label>
          <label><input type="radio" name="experience" value="あり"> あり</label>
        </div>
      </div>
      <div id="level-field" class="fld hidden">
        <label for="level">級・段<span class="req">必須</span></label>
        <input type="text" id="level" placeholder="例：8級" class="field">
      </div>

      <div class="fld">
        <label for="email">保護者さまのメールアドレス<span class="req">必須</span></label>
        <input type="email" id="email" placeholder="example@email.com" autocomplete="email" required class="field">
      </div>

      <div class="fld">
        <label for="tel">電話番号<span class="opt">任意</span></label>
        <input type="tel" id="tel" placeholder="090-1234-5678" autocomplete="tel" class="field">
      </div>

      <div class="fld">
        <label for="notes">ご質問など<span class="opt">任意</span></label>
        <textarea id="notes" rows="2" class="field"></textarea>
      </div>

      <button type="submit" id="submit-btn" class="btn submit">
        <span id="submit-text">無料体験を申し込む</span>
        <span id="submit-spinner" class="spin hidden"></span>
      </button>
      <p class="fm-foot">送信後、担当者から日時確定のご連絡をします。<br>体験後の入会の強制は一切ありません。</p>
    </form>
  </div>
</section>

<!-- コンセプト -->
<section class="cn">
  <span class="cn-pill">当教室について</span>
  <p class="cn-big">集中力<br>計算力<br>やりきる力</p>
  <p class="cn-text">楽珠そろばん教室は、頭の中に珠（たま）をイメージして<br>答えを導く「楽珠メソッド」で、<br>計算力だけでなく、集中力と<br>最後までやり遂げる力を育てます。</p>
  <img src="/Pictures/School1.webp" alt="そろばんに取り組む子どもたち" width="900" height="675" loading="lazy">
</section>
<section class="st">
  <p>計算が苦手なお子さまも<br>数字が大好きなお子さまも<br>楽珠そろばん__NAME__で<br>大きくステップアップしよう！</p>
  <span class="st-rb">ひとつひとつの“できた”が</span><br>
  <span class="st-rb">大きな自信につながる！</span>
</section>

<!-- 特長 -->
<section class="ft">
  <p class="sec-ttl">当教室の特長！</p>
  <div class="fc">
    <p class="no">01</p>
    <h3>右脳を使う<br>楽珠メソッド</h3>
    <img src="/Pictures/fv.webp" alt="" width="1200" height="900" loading="lazy">
    <span class="cap">珠をイメージして、瞬時に答えを出す！</span>
    <p>筆算のように論理で解くのではなく、珠のイメージで処理するため、計算ドリルとは違う<mark>「計算スピードと直感力」</mark>が身につきます。制限時間内に集中して解く練習で、集中力・忍耐力も育ちます。</p>
  </div>
  <div class="fc">
    <p class="no">02</p>
    <h3>少人数制で<br>目が行き届く</h3>
    <img src="/Pictures/__INSIDE__" alt="__NAME__の教室内" width="1000" height="750" loading="lazy">
    <span class="cap">わからないまま置いていかれない！</span>
    <p>1クラスの人数をしぼり、先生が<mark>一人ひとりの進度に合わせて</mark>指導します。振替制度もあるので、学校行事や他の習い事と重なっても安心です。</p>
  </div>
  <div class="fc">
    <p class="no">03</p>
    <h3>月謝の中で受けられる<br>4つの無料プログラム</h3>
    <span class="cap">おうちでも伸びる！</span>
    <div class="pg">
      <div><b>本気の朝練</b><small>毎週月曜 6:30〜<br>オンライン練習会</small></div>
      <div><b>暗算道場</b><small>毎週土曜 8:00〜<br>フラッシュ暗算も</small></div>
      <div><b>そろばん研究所</b><small>毎月第1日曜<br>上級者向け練習会</small></div>
      <div><b>解説動画</b><small>練習プリントも<br>随時配信</small></div>
    </div>
    <p>さらに年2回（8月・12月）、生徒みんなで競い合う<mark>そろばん大会「らくたまカップ」</mark>を開催。がんばりを表彰でたたえます。</p>
  </div>
</section>

<!-- 講師紹介 -->
<section class="th">
  <div class="circle">講師<br>紹介</div>
  <h2>子どもに寄り添う先生が<br>親切・丁寧に指導します</h2>
  <div class="tc">
    <img src="/Pictures/__TEACHER_IMG__" alt="__TEACHER__先生" width="110" height="130" loading="lazy">
    <div>
      <p class="nm"><small>__NAME__ 担当</small>__TEACHER__ 先生</p>
      <p>__TEACHER_MSG__</p>
    </div>
  </div>
</section>

<!-- クラスのご案内 -->
<section class="cl">
  <div class="circle">クラスの<br>ご案内</div>
  <h2 style="color:#3a3a3a;font-size:15px">お子さまのペースに合わせて週1回から通えます！</h2>
  <div class="cc">
    <div class="cc-h"><b>そろばんクラス</b><span>年中さんから</span></div>
    <p class="cc-lead">珠の動かし方から暗算まで、<br>一人ひとりの進度に合わせて進みます。</p>
    <div class="cc-row">
      <img src="/Pictures/__INSIDE__" alt="" width="120" height="120" loading="lazy">
      <div class="cc-time">
        <p class="t">レッスン曜日・時間</p>
        __DAYS_HTML__
      </div>
    </div>
    <div class="fee">
      <div><p class="t">月謝 週1回</p><b>6,050<small>円</small></b></div>
      <div><p class="t">月謝 週2回</p><b>7,700<small>円</small></b></div>
    </div>
    <p class="fee-note">※別途、事務教材費550円/月がかかります。</p>
  </div>
</section>

<!-- メソッド監修 -->
<section class="md">
  <p class="en">METHOD</p>
  <h2>楽珠メソッドとは</h2>
  <div class="md-card">
    <p>楽珠そろばん教室は、全国展開する楽珠そろばんのFC加盟校です。本部が開発した「楽珠メソッド」で、そろばんを通じて3つの力を育てます。</p>
    <div class="md-list">
      <div><b>01 暗算力と数感</b>頭の中にそろばんを浮かべる「珠算式暗算」で、一生ものの計算スピードが身につきます。</div>
      <div><b>02 集中力</b>制限時間内に正確に弾く練習で、ほかの学習にも活きる「深く集中する癖」がつきます。</div>
      <div><b>03 忍耐力と自信</b>検定を通じて「努力が結果になる」成功体験を積み重ね、自己肯定感を育みます。</div>
    </div>
  </div>
</section>

<!-- アクセス -->
<section class="ac">
  <p class="en">ACCESS</p>
  <p class="ac-name">楽珠そろばん教室 __NAME__</p>
  <div class="ac-row">
    <p>__ZIP__ __ADDRESS__<br><b>__LINE__</b><br>近くの小学校：__SCHOOLS_NEAR__</p>
    <div class="walk">__STATION__<br>より<br><b>徒歩__WALK__分</b></div>
  </div>
  <iframe src="https://www.google.com/maps?q=__MAP_Q__&output=embed" loading="lazy" title="__NAME__の地図" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <p class="ac-info">■授業日<br>__DAYS_TEXT__<br>■教室について<br>__PLACE_NOTE__</p>
  <div class="ac-links">
    <a href="https://lin.ee/sFR6X8y" class="line" target="_blank" rel="noopener">LINEで質問する</a>
    <a href="__MAP_URL__" target="_blank" rel="noopener">地図アプリで開く</a>
  </div>
</section>
<p class="ft-copy"><a href="/">楽珠そろばん教室 東京・練馬 公式サイト</a><br>運営：アルファーブレイン合同会社</p>

</div>

<!-- 固定CTA -->
<div class="fixed-cta" id="fixed-cta"><a href="#form" class="btn">体験日はコチラから <i>➜</i></a></div>

<script>
  // 当月表示（体験会タイトル）
  (function(){var m=new Date().toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',month:'numeric'}).replace(/\D/g,'');document.querySelectorAll('.js-month').forEach(function(e){e.textContent=m;});})();
  // フォームが見えている間は固定ボタンを隠す
  (function(){var f=document.getElementById('form'),c=document.getElementById('fixed-cta');if(!('IntersectionObserver' in window))return;new IntersectionObserver(function(es){c.style.display=es[0].isIntersecting?'none':'';}).observe(f);})();

  // この広告ページで固定する教室。共通JS（trial-schedule.js）は ?school= で教室を事前選択するため、URLに付けてから初期化する
  const SCHOOL = '__NAME__';
  const LP_LABEL = 'Meta広告LP（__AREA__）';
  (function () {
    const p = new URLSearchParams(location.search);
    if (p.get('school') !== SCHOOL) {
      p.set('school', SCHOOL);
      history.replaceState(null, '', location.pathname + '?' + p.toString() + location.hash);
    }
  })();
  window.ENABLE_UNLOAD_GUARD = true;
</script>
<script src="/js/form-common.js"></script>
<script src="/js/trial-schedule.js"></script>
<script>
  initTrialSchedule({ classroomSelectId: 'classroom', minDateMode: 'nextDay18' });

  document.querySelectorAll('input[name="experience"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('level-field').classList.toggle('hidden', radio.value !== 'あり' || !radio.checked);
    });
  });

  document.getElementById('taiken-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('error-box');
    errorBox.classList.add('hidden');

    const v = id => document.getElementById(id).value.trim();
    const familyName = v('family-name');
    const givenName = v('given-name');
    const grade = v('grade');
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const levelIfAny = experience === 'あり' ? v('level') : '';
    const email = v('email');
    const tel = v('tel');
    const pref1d = v('pref1-date'), pref1t = v('pref1-time');
    const pref2d = v('pref2-date'), pref2t = v('pref2-time');

    const errors = [];
    if (!pref1d || !pref1t) errors.push('第1希望の日付・時間を選択してください');
    if (!pref2d || !pref2t) errors.push('第2希望の日付・時間を選択してください');
    if (pref1d && pref1t && pref1d === pref2d && pref1t === pref2t) errors.push('第1希望と第2希望は異なる日時をお選びください');
    if (!familyName || !givenName) errors.push('お子さまのお名前をご入力ください');
    if (experience === 'あり' && !levelIfAny) errors.push('そろばんの級・段をご入力ください');
    if (!email) errors.push('メールアドレスをご入力ください');
    if (errors.length) {
      errorBox.textContent = errors.join(' / ');
      errorBox.classList.remove('hidden');
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 流入元を kintone 体験名簿の備考に残す（広告クリエイティブ別に追えるよう utm_content も付ける）
    const utmContent = new URLSearchParams(location.search).get('utm_content') || '';
    const sourceTag = `【流入】${LP_LABEL}${utmContent ? '／' + utmContent : ''}`;
    const userNotes = v('notes');
    const notes = userNotes ? `${sourceTag}\n${userNotes}` : sourceTag;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    document.getElementById('submit-text').textContent = '送信中...';
    document.getElementById('submit-spinner').classList.remove('hidden');

    try {
      const response = await fetch(`${API_BASE}/api/taiken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          氏: familyName,
          名: givenName,
          フリガナ: '',
          学年: grade,
          電話番号: tel,
          メールアドレス: email,
          住所: '',
          そろばん経験: experience,
          '級・段': levelIfAny,
          教室名: SCHOOL,
          希望日時: mergePreferredDatetimeForKintone(),
          備考: notes,
          紹介者: '',
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || `送信に失敗しました（${response.status}）`);
      }
      // CV（GA4・Meta Lead）は trial-thanks のページビューで計測
      window.location.href = '/trial-thanks';
    } catch (err) {
      const isNetworkErr = !err.message || err.message === 'Failed to fetch' || err.message.includes('NetworkError') || err.message.includes('network');
      errorBox.textContent = isNetworkErr
        ? '通信エラーが発生しました。電波の良い場所で再度お試しください。'
        : err.message;
      errorBox.classList.remove('hidden');
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.disabled = false;
      document.getElementById('submit-text').textContent = '無料体験を申し込む';
      document.getElementById('submit-spinner').classList.add('hidden');
    }
  });

  (function () {
    let fired = false;
    document.getElementById('taiken-form').addEventListener('focusin', function (e) {
      if (fired || !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      fired = true;
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({ event: 'form_start', form_name: 'taiken_meta_lp' });
    });
  })();
</script>
</body>
</html>
'''

for s in SCHOOLS:
    days_html = ''.join(f'<p>{d}<br>{t}</p>' for d, t in s['days'])
    days_text = '<br>'.join(f'{d}　{t}' for d, t in s['days'])
    rep = {
        '__PIXEL__': PIXEL_ID,
        '__NAME__': s['name'], '__AREA__': s['area'], '__STATION__': s['station_short'],
        '__WALK__': s['walk'], '__LINE__': s['line'], '__ZIP__': s['zip'], '__ADDRESS__': s['address'],
        '__MAP_Q__': html.escape(s['map_q']), '__MAP_URL__': s['map_url'],
        '__DAYS_SHORT__': s['days_short'], '__DAYS_HTML__': days_html, '__DAYS_TEXT__': days_text,
        '__SCHOOLS_NEAR__': s['schools_near'], '__INSIDE__': s['inside'],
        '__TEACHER__': s['teacher'], '__TEACHER_IMG__': s['teacher_img'], '__TEACHER_MSG__': s['teacher_msg'],
        '__PLACE_NOTE__': s['place_note'],
    }
    out = TEMPLATE
    for k, v in rep.items():
        out = out.replace(k, v)
    assert '__' not in out.replace('__name__', ''), [l for l in out.splitlines() if '__' in l][:3]
    (ROOT / 'LP' / f"{s['slug']}.html").write_text(out, encoding='utf-8')
    print('wrote', s['slug'])
