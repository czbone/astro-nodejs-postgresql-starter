import { useState, type FormEvent } from 'react'

type User = {
  id: number
  email: string
  name: string | null
}

type Props = {
  users: User[]
}

export default function PostForm({ users }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [published, setPublished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: content || undefined,
          authorId: parseInt(authorId),
          published
        })
      })

      if (response.ok) {
        setTitle('')
        setContent('')
        setAuthorId('')
        setPublished(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error || '作成に失敗しました'}`)
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">新規投稿作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
            著者 *
          </label>
          <select
            id="authorId"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">著者を選択</option>
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
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            公開する
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? '作成中...' : '作成'}
        </button>
      </form>
    </div>
  )
}
