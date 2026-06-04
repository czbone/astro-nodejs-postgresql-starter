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
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id!) },
      include: { author: true }
    })

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const body = await request.json()
    const { title, content, published, authorId } = body

    const post = await prisma.post.update({
      where: { id: parseInt(params.id!) },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published }),
        ...(authorId !== undefined && { authorId })
      }
    })

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  console.log('DELETE handler called for post:', params.id)
  console.log('Request method:', request.method)
  console.log(request.headers.get('origin'))
  console.log(request.headers.get('host'))
  console.log(request.headers.get('x-forwarded-host'))

  try {
    const postId = parseInt(params.id!)
    console.log('Attempting to delete post with ID:', postId)

    await prisma.post.delete({
      where: { id: postId }
    })

    console.log('Post deleted successfully:', postId)
    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Delete error:', error)
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return new Response(
      JSON.stringify({ error: 'Failed to delete post', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}
