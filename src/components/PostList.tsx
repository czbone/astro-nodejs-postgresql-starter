import { useState } from 'react'

type User = {
  id: number
  email: string
  name: string | null
}

type Post = {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number
  author: User
}

type Props = {
  initialPosts: Post[]
  users: User[]
}

export default function PostList({ initialPosts, users }: Props) {
  const [posts] = useState<Post[]>(initialPosts)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editAuthorId, setEditAuthorId] = useState('')
  const [editPublished, setEditPublished] = useState(false)

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content || '')
    setEditAuthorId(post.authorId.toString())
    setEditPublished(post.published)
  }

  const handleCancel = () => {
    setEditingPostId(null)
    setEditTitle('')
    setEditContent('')
    setEditAuthorId('')
    setEditPublished(false)
  }

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent || undefined,
          authorId: parseInt(editAuthorId),
          published: editPublished
        })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error || '更新に失敗しました'}`)
      }
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  const handleTogglePublished = async (id: number, published: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error || '更新に失敗しました'}`)
      }
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('この投稿を削除してもよろしいですか?')) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error || '削除に失敗しました'}`)
      }
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">投稿一覧</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border border-gray-200 p-4">
            {editingPostId === post.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">タイトル</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">内容</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">著者</label>
                  <select
                    value={editAuthorId}
                    onChange={(e) => setEditAuthorId(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editPublished}
                    onChange={(e) => setEditPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">公開する</label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(post.id)}
                    className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-semibold">{post.title}</div>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? '公開' : '下書き'}
                    </span>
                  </div>
                  {post.content && <div className="mt-2 text-gray-600">{post.content}</div>}
                  <div className="mt-2 text-sm text-gray-500">
                    著者: {post.author.name || post.author.email}
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleTogglePublished(post.id, !post.published)}
                    className={`w-20 cursor-pointer rounded px-3 py-1 text-sm ${
                      post.published
                        ? 'bg-gray-500 text-white hover:bg-gray-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {post.published ? '非公開' : '公開'}
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="w-20 cursor-pointer rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="w-20 cursor-pointer rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-4 text-center text-gray-500">投稿がまだ登録されていません</p>
        )}
      </div>
    </div>
  )
}
