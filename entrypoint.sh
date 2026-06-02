#!/bin/bash
set -e

echo "🚀 Starting application..."

# DATABASE_URL環境変数の検証
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "✅ DATABASE_URL is configured"

# データベース接続の待機（オプション：PostgreSQLが起動するまで待つ）
echo "⏳ Waiting for database connection..."
max_attempts=30
attempt=0

until pnpm exec prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
    attempt=$((attempt + 1))
    echo "   Attempt $attempt/$max_attempts - Waiting for database..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Error: Could not connect to database after $max_attempts attempts"
    exit 1
fi

echo "✅ Database connection established"

# Prismaマイグレーションの実行
echo "🔄 Running database migrations..."
pnpm exec prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Error: Migration failed"
    exit 1
fi

# オプション：初回デプロイ時のシード実行
# 環境変数 RUN_SEED=true を設定すると実行される
if [ "$RUN_SEED" = "true" ]; then
    echo "🌱 Running database seed..."
    pnpm run db:seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Seed completed successfully"
    else
        echo "⚠️  Warning: Seed failed (continuing anyway)"
    fi
fi

# Node.jsサーバーの起動
echo "🎯 Starting Node.js server..."
exec node dist/server/entry.mjs
