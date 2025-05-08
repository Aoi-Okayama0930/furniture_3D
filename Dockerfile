FROM node:20-alpine AS base

# 依存関係をインストールするための一時ステージ
FROM base AS deps
WORKDIR /app

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

# 依存関係のインストール
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ビルド用のステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NextJSアプリをビルド
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm build

# 実行用のステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 必要なファイルとディレクトリだけをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 