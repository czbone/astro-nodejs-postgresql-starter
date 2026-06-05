# Copilot Instructions

このリポジトリで GitHub Copilot がコード提案・自動生成を行うときは、以下の前提と規約を強く優先してください。

## プロジェクト概要
- Astro を SSR モードで使用し、Node.js アダプターで配信するフルスタック構成です。
- UI は Astro ページをベースにし、対話的な箇所だけ React コンポーネントを Islands として `client:load` で読み込みます。
- データアクセスは Prisma 7 と PostgreSQL を使用します。
- スタイリングは Tailwind CSS 4 を使い、既存のユーティリティクラス中心の書き方に合わせます。
- パッケージマネージャーは pnpm です。コマンド例は pnpm を前提にしてください。

## 技術スタック
- Astro 6
- TypeScript
- React 19
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- @prisma/adapter-pg

## 実装方針
- 既存の構成を尊重し、Astro ページは `src/pages`、React コンポーネントは `src/components`、共通ロジックは `src/lib` に置いてください。
- インポートは既存どおり `@/*` エイリアスを優先してください。
- TypeScript は strict 前提です。型を曖昧にせず、`any` は避けてください。
- 既存コードはセミコロンなし、シングルクォート、簡潔な関数実装が中心です。同じスタイルに合わせてください。
- UI 文言、バリデーションメッセージ、エラーメッセージは既存コードに合わせて日本語を優先してください。
- 変更は最小限にとどめ、不要な抽象化や大規模なリファクタリングは避けてください。

## Astro と React の指針
- ページ単位のデータ取得はできるだけ Astro 側で行い、初期表示に必要なデータをまとめて取得してください。
- React コンポーネントはフォーム、一覧、インライン編集など、ブラウザ側の状態管理が必要な箇所に限定してください。
- 既存の実装に合わせ、React 側では `useState` と素直なイベントハンドラを優先し、不要な複雑化は避けてください。
- 新規 UI は既存ページのトーンに合わせ、白背景のカード、適度なシャドウ、Tailwind の標準ユーティリティで構成してください。
- ページ遷移やデータ更新で高度な状態管理ライブラリを追加しないでください。現状はシンプルな fetch ベースです。

## API ルートの指針
- API エンドポイントは `src/pages/api` 配下の Astro API Routes として実装してください。
- `GET`、`POST`、`PATCH`、`DELETE` などは `APIRoute` を使って明示的にエクスポートしてください。
- レスポンスは `new Response(JSON.stringify(...), { status, headers: { 'Content-Type': 'application/json' } })` の既存パターンに揃えてください。
- 必須項目のチェック、ID の数値変換、関連データの存在確認など、基本的な入力バリデーションを必ず追加してください。
- 想定できる失敗は `400`、`404`、`409`、`500` など適切な HTTP ステータスで返してください。
- 例外時は既存コードに合わせて `console.error` で文脈つきの日本語メッセージを出してください。

## Prisma の指針
- Prisma Client は必ず `src/lib/prisma.ts` の `prisma` インスタンスを使ってください。新しい PrismaClient を各所で生成しないでください。
- Prisma の import は `@/generated/prisma/client` を前提にしています。標準の `@prisma/client` に置き換えないでください。
- PostgreSQL 接続には `@prisma/adapter-pg` を使っています。アプリコード内で独自に `pg.Pool` を組み立てる実装は避けてください。
- 一覧取得では必要に応じて `include` と `orderBy` を使い、ページ表示に必要な関連データをまとめて取得してください。
- `authorId` など数値 ID を受け取る箇所では、保存前に数値変換と妥当性確認を行ってください。
- Prisma スキーマを変えた場合は、マイグレーション、生成物、seed への影響も意識してください。

## データモデルの前提
- `User` は `email` がユニークで、`name` は nullable です。
- `Post` は `title` 必須、`content` nullable、`published` は boolean、`authorId` で `User` と関連します。
- `Post.author` は必須リレーションで、ユーザー削除時は cascade されます。

## スタイリングの指針
- スタイリングは Tailwind のユーティリティクラスで完結させることを優先してください。
- 既存 UI は管理画面風のシンプルな見た目なので、過剰な装飾や新規デザインシステムの導入は避けてください。
- レイアウトはレスポンシブを維持し、`max-w-*`、`grid`、`gap-*`、`px-*`、`py-*` の既存パターンを踏襲してください。

## 生成・変更時の注意
- まず既存ファイルの近い実装を参照し、同じ責務の場所に合わせて追記・修正してください。
- 新しい依存関係の追加は、本当に必要な場合だけに限定してください。
- 生成コードがある `src/generated/prisma` は手編集しないでください。
- `DATABASE_URL` が必須である前提を崩さないでください。
- Dockerfile、entrypoint.sh、本番起動フローに関わる変更は、マイグレーション適用と Prisma 生成物の扱いに注意してください。

## 推奨コマンド
- 開発: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Prisma Client 生成: `pnpm db:generate`
- マイグレーション: `pnpm db:migrate`
- Seed: `pnpm db:seed`
- Prisma Studio: `pnpm db:studio`

## Copilot への期待
- 既存の CRUD 実装を壊さず、同じ粒度と書き方で機能追加してください。
- コード例を出すときは、このリポジトリのファイル構成と命名に合わせてください。
- 回答や提案では、Astro、React、Prisma、Tailwind の責務境界を崩さないでください。
