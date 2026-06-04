import { prisma } from '@/lib/prisma'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id!) },
      include: { posts: true }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const body = await request.json()
    const { email, name } = body

    const user = await prisma.user.update({
      where: { id: parseInt(params.id!) },
      data: {
        ...(email !== undefined && { email }),
        ...(name !== undefined && { name })
      }
    })

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const userId = parseInt(params.id!)

    // トランザクションで関連する投稿とユーザーを削除
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: { authorId: userId }
      }),
      prisma.user.delete({
        where: { id: userId }
      })
    ])

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
