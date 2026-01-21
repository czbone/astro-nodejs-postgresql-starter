import { useState } from 'react'

type User = {
  id: number
  email: string
  name: string | null
  posts: Array<{ id: number }>
}

type Props = {
  initialUsers: User[]
}

export default function UserList({ initialUsers }: Props) {
  const [users] = useState<User[]>(initialUsers)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editName, setEditName] = useState('')

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditEmail(user.email)
    setEditName(user.name || '')
  }

  const handleCancel = () => {
    setEditingUserId(null)
    setEditEmail('')
    setEditName('')
  }

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editEmail,
          name: editName || undefined
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

  const handleDelete = async (id: number) => {
    if (!confirm('このユーザーを削除してもよろしいですか?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
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
      <h2 className="mb-4 text-xl font-semibold">ユーザー一覧</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-gray-200 p-4">
            {editingUserId === user.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">名前</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(user.id)}
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
                  <div className="text-lg font-semibold">{user.name || '名前なし'}</div>
                  <div className="text-gray-600">{user.email}</div>
                  <div className="mt-1 text-sm text-gray-500">投稿数: {user.posts.length}</div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="w-20 cursor-pointer rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-20 cursor-pointer rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {users.length === 0 && (
          <p className="py-4 text-center text-gray-500">ユーザーがまだ登録されていません</p>
        )}
      </div>
    </div>
  )
}
