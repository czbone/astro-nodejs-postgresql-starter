# Astro + Node.js + PostgreSQL スターターキット

Astro 5 (SSR)、Prisma 7、PostgreSQL、React、Tailwind CSS 4を組み合わせた、モダンなフルスタックWebアプリケーションのスターターテンプレート。Node.jsスタンドアロンサーバーとして動作し、本番環境へすぐにデプロイ可能です。

## 画面イメージ

![画面イメージ](https://github.com/user-attachments/assets/cb8fe752-9d9b-49eb-bbbc-9b03ffe8fde0)

## 技術スタック

- [Astro](https://astro.build/) - コンテンツ駆動型Webサイトのためのフレームワーク（SSRモード、Node.jsアダプター）
- [Prisma 7](https://www.prisma.io/) - モダンなデータベースORM（`prisma.config.ts`による設定管理）
- [PostgreSQL](https://www.postgresql.org/) - リレーショナルデータベース（`@prisma/adapter-pg`使用）
- [React 19](https://react.dev/) - インタラクティブコンポーネント（Islands Architecture）
- [TailwindCSS v4](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク（Viteプラグイン経由）
- [TypeScript](https://www.typescriptlang.org/) - 型安全性

## 機能

- 👥 **ユーザー管理**: ユーザーの作成・表示
- 📝 **投稿管理**: 投稿の作成・表示
- 🔗 **リレーションシップ**: ユーザーと投稿の関連付け
- 🎨 **モダンUI**: TailwindCSSによる美しいデザイン
- 📱 **レスポンシブ**: モバイル対応のレイアウト

## 必要要件

- Node.js v20以上
- pnpm v10以上
- PostgreSQLサーバー

## セットアップ

### 1. 依存関係のインストール

```bash
# リポジトリをクローン
git clone [リポジトリのURL]

# プロジェクトディレクトリに移動
cd astro-nodejs-postgresql-starter

# 依存関係のインストール
pnpm install
```

### 2. データベースの設定

`.env`ファイルを作成し、データベース接続情報を設定：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

**注意**: 接続URLは`postgresql://`プロトコルを使用し、Prismaの`@prisma/adapter-pg`を通じてPostgreSQLに接続されます。

### 3. データベースの初期化

```bash
# Prismaクライアントの生成
pnpm db:generate

# データベースのマイグレーション
pnpm db:migrate

# 初期データの挿入（オプション）
pnpm db:seed

# データベースの確認（オプション）
pnpm db:studio
```

`pnpm db:seed` は `prisma/seed.ts` を実行し、Prisma経由で初期データを投入します。

### 4. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスしてアプリケーションを確認できます。

## 開発コマンド

```bash
# 開発サーバーの起動
pnpm dev

# プロダクションビルド
pnpm build

# ビルドのプレビュー
pnpm preview

# プロダクションサーバーの起動
pnpm start

# ESLintによるコード検証
pnpm lint

# Prisma関連コマンド
pnpm db:generate    # Prismaクライアントの生成
pnpm db:migrate     # データベースのマイグレーション
pnpm db:studio      # Prisma Studioの起動
pnpm db:reset       # データベースのリセット
pnpm db:seed        # 初期データの挿入
```

## データベースモデル

### User（ユーザー）
- `id`: 主キー（自動増分）
- `email`: メールアドレス（ユニーク）
- `name`: 名前（オプション）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `posts`: 関連する投稿（1対多）

### Post（投稿）
- `id`: 主キー（自動増分）
- `title`: タイトル
- `content`: 内容（オプション）
- `published`: 公開状態
- `authorId`: 投稿者ID（外部キー）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `author`: 関連するユーザー（多対1）

## APIエンドポイント

### ユーザーAPI
- `GET /api/users` - ユーザー一覧の取得（投稿情報を含む）
- `POST /api/users` - ユーザーの作成（email, nameを指定）
- `GET /api/users/[id]` - 特定ユーザーの取得（投稿情報を含む）
- `PATCH /api/users/[id]` - ユーザー情報の更新（email, name）
- `DELETE /api/users/[id]` - ユーザーの削除

### 投稿API
- `GET /api/posts` - 投稿一覧の取得（著者情報を含む）
- `POST /api/posts` - 投稿の作成（title, content, authorIdを指定）
- `GET /api/posts/[id]` - 特定投稿の取得（著者情報を含む）
- `PATCH /api/posts/[id]` - 投稿情報の更新（title, content, published, authorId）
- `DELETE /api/posts/[id]` - 投稿の削除

### エラーレスポンス
- `400` - バリデーションエラー（必須項目の欠落など）
- `404` - リソースが見つからない
- `409` - データの競合（例: メールアドレスの重複）
- `500` - サーバーエラー

## 本番環境へのデプロイ

### ビルドと起動

```bash
# プロダクションビルド
pnpm build

# Node.jsスタンドアロンサーバーとして起動
pnpm start
```

本番環境では、Astroが自動的に`NODE_ENV=production`を設定します。ビルド後の成果物は`dist/`ディレクトリに生成され、`pnpm start`コマンドで`node ./dist/server/entry.mjs`が実行されます。

### 環境変数の設定

本番環境用の`.env`ファイルを作成するか、システム環境変数として`DATABASE_URL`を設定してください：

```env
DATABASE_URL="postgresql://username:password@production-host:5432/database_name"
```

### Dockerfile と entrypoint.sh の役割

このリポジトリには、Coolify などのコンテナ環境でそのまま使える [Dockerfile](Dockerfile) と [entrypoint.sh](entrypoint.sh) が含まれています。

`Dockerfile` はマルチステージビルド構成です。

- `dependencies` ステージで本番依存関係だけをインストールします。
- `build` ステージで開発依存関係を含めてインストールし、`pnpm run db:generate` で Prisma Client を生成したあとに `pnpm run build` を実行します。
- `production` ステージには、実行に必要な `node_modules`、ビルド済みの `dist`、実行時に参照する `src/generated`、`prisma` ディレクトリ、`prisma.config.ts`、`entrypoint.sh` だけをコピーします。
- 本番イメージは非 root ユーザー `nodejs` で動作し、`HEALTHCHECK` で `/` への HTTP アクセスを監視します。
- コンテナ起動時は `ENTRYPOINT ["./entrypoint.sh"]` により、Node.js サーバーを直接起動する前に初期化処理を挟みます。

`entrypoint.sh` は、コンテナ起動時に次の順序で処理を行います。

1. `DATABASE_URL` が設定されているか確認します。
2. `pnpm prisma db execute --stdin <<< "SELECT 1;"` を使ってデータベース接続を確認し、最大 30 回までリトライします。
3. 接続できたら `pnpm prisma migrate deploy` を実行し、本番用マイグレーションを適用します。
4. `RUN_SEED=true` が設定されている場合だけ `pnpm run db:seed` を実行します。
5. 最後に `node dist/server/entry.mjs` を起動して Astro の本番サーバーを立ち上げます。

開発環境で使う `pnpm db:migrate` は `prisma migrate dev` を呼び出しますが、コンテナ起動時は [entrypoint.sh](entrypoint.sh) から `prisma migrate deploy` を使って既存マイグレーションだけを安全に適用します。

Docker 運用で最低限必要な環境変数は次の 2 つです。

```env
DATABASE_URL="postgresql://username:password@production-host:5432/database_name"
RUN_SEED="false"
```

- `DATABASE_URL`: Prisma と起動スクリプトの両方が参照する必須値です。
- `RUN_SEED`: 任意です。初回デプロイ時などにだけ `true` を設定してください。

### ポート設定

デフォルトでは`http://localhost:3000`でサーバーが起動します。ポートを変更する場合は、`astro.config.mjs`の`server`セクションで設定を変更してください：

```javascript
export default defineConfig({
  server: {
    port: 4000,  // 任意のポート番号
    host: true
  }
})
```

### docker-compose.yaml（Coolify 統合）

本プロジェクトの [docker-compose.yaml](docker-compose.yaml) は Coolify でのデプロイを想定した設定になっています。

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    networks:
      - coolify
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - PORT=${PORT:-3000}
networks:
  coolify:
    external: true
```

**設定の詳細：**

- **networks**: `coolify` 外部ネットワークに接続し、Coolify 上の他のリソース（PostgreSQL など）と通信可能にします。
- **ports**: `${PORT:-3000}:${PORT:-3000}` で、環境変数 `PORT` によりポートを可変にします。
  - 環境変数 `PORT=8080` が設定されている場合、ホストとコンテナ両方でポート 8080 で動作します
  - 指定されない場合はデフォルト 3000 が使われます
- **environment**: `PORT=${PORT:-3000}` により、Coolify からの `PORT` 環境変数が Astro アプリケーションに渡されます。

**Coolify での使用方法：**

1. PostgreSQL リソースを別途作成し、接続文字列を控えておきます
2. 本アプリケーションをデプロイする際、以下の環境変数を設定します：
   ```
   DATABASE_URL=postgresql://username:password@postgres-service:5432/database_name
   PORT=3000  # 任意のポート番号に変更可能
   ```
3. Docker Compose ファイル（本ファイル）を使用して、Coolify で起動します

**必要な環境変数：**

Docker 運用で最低限必要な環境変数は次の 3 つです。

```env
DATABASE_URL="postgresql://username:password@production-host:5432/database_name"
PORT="3000"
RUN_SEED="false"
```

- `DATABASE_URL`: Prisma と起動スクリプトの両方が参照する必須値です。
- `PORT`: Coolify のポート設定に応じて指定してください。省略時はデフォルト 3000 です。
- `RUN_SEED`: 任意です。初回デプロイ時などにだけ `true` を設定してください。

### Prisma設定

本番環境でも開発環境と同様に、デプロイ前に以下のコマンドを実行してください：

```bash
# Prismaクライアントの生成
pnpm db:generate

# マイグレーションの適用（本番DBに対して）
pnpm db:migrate
```

## プロジェクト構造

```
├── src/
│   ├── components/
│   │   ├── UserForm.tsx       # ユーザー作成フォーム（React）
│   │   ├── UserList.tsx       # ユーザー一覧（React）
│   │   ├── PostForm.tsx       # 投稿作成フォーム（React）
│   │   └── PostList.tsx       # 投稿一覧（React）
│   ├── lib/
│   │   └── prisma.ts          # Prismaクライアントの設定
│   ├── pages/
│   │   ├── api/
│   │   │   ├── users.ts       # ユーザーAPI
│   │   │   ├── posts.ts       # 投稿API
│   │   │   ├── users/
│   │   │   │   └── [id].ts    # 個別ユーザーAPI
│   │   │   └── posts/
│   │   │       └── [id].ts    # 個別投稿API
│   │   ├── index.astro        # ダッシュボード
│   │   ├── users.astro        # ユーザー管理ページ
│   │   └── posts.astro        # 投稿管理ページ
│   ├── layouts/
│   │   ├── Layout.astro       # ページレイアウト
│   │   └── Navigation.astro   # ナビゲーションバー
│   ├── scripts/
│   │   └── index.js           # Flowbiteスクリプト
│   └── styles/
│       └── global.css         # グローバルスタイル（Tailwind CSS）
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   ├── seed.ts                # 初期データ挿入スクリプト
│   └── migrations/            # マイグレーションファイル
├── public/                    # 静的アセット
├── prisma.config.ts           # Prisma 7設定ファイル
├── astro.config.mjs           # Astroの設定
├── tsconfig.json              # TypeScriptの設定
└── package.json               # プロジェクトの依存関係とスクリプト
```

### Prisma 7の設定

本プロジェクトではPrisma 7の設定ファイル方式を採用しており、`prisma.config.ts`で以下を管理しています：

- **スキーマパス**: `prisma/schema.prisma`
- **マイグレーションパス**: `prisma/migrations`
- **データソースURL**: 環境変数`DATABASE_URL`から取得

`prisma.config.ts`を使用することで、複数環境での設定管理が容易になり、TypeScriptの型安全性を活用できます。

## 使用方法

1. ブラウザで `http://localhost:3000` にアクセス
2. 左側の「ユーザー管理」セクションでユーザーを作成
3. 右側の「投稿管理」セクションで投稿を作成
4. 作成したユーザーと投稿がリアルタイムで表示されます

## トラブルシューティング

### データベース接続エラー
- `.env`ファイルの`DATABASE_URL`が正しく設定されているか確認
- データベースサーバーが起動しているか確認
- ファイアウォールの設定を確認

### Prismaクライアントエラー
```bash
pnpm db:generate
```

### マイグレーションエラー
```bash
pnpm db:reset
pnpm db:migrate
```

## 参考リンク

- [Prisma Documentation](https://www.prisma.io/docs)
- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## ライセンス

MITライセンス