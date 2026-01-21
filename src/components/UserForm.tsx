import { useState, type FormEvent } from 'react'

export default function UserForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined
        })
      })

      if (response.ok) {
        setEmail('')
        setName('')
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
      <h2 className="mb-4 text-xl font-semibold">新規ユーザー作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
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
