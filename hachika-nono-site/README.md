# 八花ノノ 公式サイト

静的サイト（HTML / CSS / Vanilla JS のみ、フレームワーク不使用）。
GitHub Pages や Cloudflare Pages にそのまま配置できます。

ページ遷移なしの1ページ完結（LP）構成です。WORKS / PROFILE / CONTACT は
すべて `index.html` 内のセクションで、ヘッダー・フッターのリンクはアンカースクロールで移動します。

## 構成

```
/
├── index.html              1ページ完結（HERO / WORKS / PROFILE / CONTACT）
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── works-data.js     ★作品データはここ1箇所で管理
    │   └── main.js
    └── images/               プレースホルダー画像（SVG）
```

## 作品を追加する方法

1. `assets/js/works-data.js` の配列に1件追加する
   （slug / title / type / pages / year / genre / description / story / thumbnail / externalLink / featured）
   - `description`：短い紹介文（現状未使用だが保持）
   - `story`：TOPページのWORKSセクションに表示される本文
2. 画像を `assets/images/` に追加する

TOPページの FEATURED WORK と WORKS プレビューは `works-data.js` から
自動生成されるため、`index.html` 側の編集は不要です。

## 今回はダミーデータで作成しています

作品タイトル・あらすじ・画像はすべて仮のものです。
実際の作品情報が決まり次第、`works-data.js` を差し替えてください。
画像は `assets/images/` 内のSVGプレースホルダーを実際の作品画像（WebP/AVIF推奨）に置き換えてください。

## 未実装（将来対応の余地を残した箇所）

- CONTACTフォームの送信処理（現状はフロントのみのデモ）
- CONTACTのSNSリンク（Instagram / Facebookは仮のURL、実際のアカウントに差し替え要）
