import { prisma } from '@/lib/prisma'
import type { APIRoute } from 'astro'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  })
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id!) },
      include: { posts: true }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Email already exists' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  console.log('DELETE handler called for user:', params.id)
  console.log('Request method:', request.method)

  try {
    const userId = parseInt(params.id!)
    console.log('Attempting to delete user with ID:', userId)

    // カスケード削除により、関連する投稿も自動的に削除されます
    await prisma.user.delete({
      where: { id: userId }
    })

    console.log('User deleted successfully:', userId)
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Delete error:', error)
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return new Response(
      JSON.stringify({ error: 'Failed to delete user', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}
