# coco-rin-booking
# coco-rin 宿泊予約システム

## プロジェクト概要
宿泊施設の予約をオンラインで受け付けるためのWebシステムです。
Reservation system for coco-rin

## 開発環境のセットアップ

### 必要な環境
- Node.js (v16以上)
- npm (v8以上)

### インストール手順
1. 依存パッケージのインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

3. ビルド
```bash
npm run build
```

## 技術スタック
- フロントエンド: Vue.js 3
- ビルドツール: Vite
- スタイリング: CSS
- 状態管理: Vuex
- ルーティング: Vue Router

## プロジェクト構造
```
/
├── src/                  # ソースコード
│   ├── assets/          # 画像やフォントなどの静的ファイル
│   ├── components/      # Vueコンポーネント
│   ├── views/           # ページコンポーネント
│   ├── styles/          # CSSファイル
│   └── utils/           # ユーティリティ関数
├── public/              # 静的ファイル
└── docs/                # ドキュメント
```
