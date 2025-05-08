This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and tweak the numbers to see the shelf rebuild in real time.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Parametric Shelf Builder

3Dパラメトリック棚ビルダーアプリケーション。数値パラメータを調整することで、リアルタイムで棚のデザインをカスタマイズできます。

![Shelf Builder Preview](./public/shelf-preview.png)

## 機能

- 寸法の調整: 幅、高さ、奥行き
- 区画設定: 列数と行数
- 本と小物の表示/非表示
- セクションごとの本の数調整
- ランダム本配置機能

## Docker で実行する方法

### 前提条件

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (最近のDockerには通常含まれています)

### 本番モードで実行

最適化されたビルドで実行:

```bash
# イメージをビルドして実行
docker compose up app

# またはバックグラウンドで実行
docker compose up -d app
```

### 開発モードで実行

ライブリロード機能付きの開発環境:

```bash
# 開発環境を起動
docker compose up dev

# またはバックグラウンドで実行
docker compose up -d dev
```

どちらの場合も、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてアプリケーションを使用できます。

### コンテナの停止

```bash
# 通常停止
docker compose down

# コンテナとイメージを削除
docker compose down --rmi local

# コンテナ、イメージ、ボリュームを削除
docker compose down --rmi local -v
```

## ローカル環境での実行方法

Docker環境を使わずに、ローカルで直接実行する場合は以下の手順に従ってください。

### 必要な環境

- Node.js 18.0.0以上
- pnpm 8.0.0以上

### セットアップ手順

```bash
# リポジトリをクローン
git clone <リポジトリURL>
cd shelf-builder

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、パラメータを調整して棚のデザインをカスタマイズできます。

### ビルドと本番実行

```bash
# アプリケーションをビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - Three.jsのReactレンダラー
- [Three.js](https://threejs.org/) - 3Dグラフィックスライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全な開発環境
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Docker](https://www.docker.com/) - コンテナ化プラットフォーム

## Dockerファイルの構成

- `Dockerfile` - 本番環境用のマルチステージビルド設定
- `Dockerfile.dev` - 開発環境用の設定（ホットリロード対応）
- `docker-compose.yml` - Docker Composeサービス定義
- `.dockerignore` - Dockerビルドから除外するファイル
