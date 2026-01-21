import { prisma } from '@/lib/prisma'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true
      }
    })

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('ユーザー取得エラー:', error)
    return new Response(JSON.stringify({ error: 'ユーザーの取得に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { email, name } = body

    // 既存ユーザーの確認
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'このメールアドレスは既に登録されています' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        name
      }
    })

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('ユーザー作成エラー:', error)
    return new Response(JSON.stringify({ error: 'ユーザーの作成に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
