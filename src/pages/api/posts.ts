import { prisma } from '@/lib/prisma'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true
      }
    })

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('投稿取得エラー:', error)
    return new Response(JSON.stringify({ error: '投稿の取得に失敗しました' }), {
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
    const { title, content, authorId, published = false } = body

    // 入力バリデーション
    if (!title || title.trim() === '') {
      return new Response(JSON.stringify({ error: 'タイトルは必須です' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    if (!authorId) {
      return new Response(JSON.stringify({ error: '著者IDは必須です' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // 著者の存在確認
    const author = await prisma.user.findUnique({
      where: { id: parseInt(authorId) }
    })

    if (!author) {
      return new Response(JSON.stringify({ error: '指定された著者が存在しません' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: parseInt(authorId)
      },
      include: {
        author: true
      }
    })

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('投稿作成エラー:', error)
    return new Response(JSON.stringify({ error: '投稿の作成に失敗しました' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
