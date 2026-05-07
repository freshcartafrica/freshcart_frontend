import { useEffect, useState } from 'react'
import { endpoints } from '../../lib/api'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await endpoints.adminUsers()
        if (!cancelled) setUsers(response.data)
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load admin users.')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Admin users</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">All registered marketplace accounts.</h1>
      {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {users.map((user) => (
          <article key={user.id} className="rounded-[24px] bg-brand-cream p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-ink">{user.full_name}</p>
                <p className="text-sm text-brand-ink/55">{user.email}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-brand-orange">{user.role}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
