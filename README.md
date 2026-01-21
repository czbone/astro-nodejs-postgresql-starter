# Astro + Node.js + PostgreSQL スターターキット

Astro 5 (SSR)、Prisma 7、PostgreSQL、React、Tailwind CSS 4を組み合わせた、モダンなフルスタックWebアプリケーションのスターターテンプレート。Node.jsスタンドアロンサーバーとして動作し、本番環境へすぐにデプロイ可能です。

## 画面イメージ

![画面イメージ](https://github.com/user-attachments/assets/ccbed749-1666-4144-ac21-1197cae7d797)

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
cd astro-tailwind4-flowbite-db-starter-ex

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