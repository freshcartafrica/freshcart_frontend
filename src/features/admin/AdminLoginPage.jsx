import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const tokenResponse = await endpoints.login(form)
      const token = tokenResponse.data.access_token
      setSession({ token, user: null })
      const me = await endpoints.me()
      if (me.data.role !== 'admin') throw new Error('This account is not an admin account.')
      setSession({ token, user: me.data })
      navigate('/admin', { replace: true })
    } catch (submitError) {
      setSession({ token: '', user: null })
      setError(submitError?.response?.data?.detail || submitError.message || 'Unable to log in as admin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <form className="surface w-full max-w-md p-8" onSubmit={handleSubmit}>
        <p className="text-sm text-brand-ink/55">Admin login</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Admin access</h1>
        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
        <div className="mt-6 grid gap-4">
          <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Admin email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          <button className="primary-button">{isSubmitting ? 'Signing in...' : 'Login as admin'}</button>
        </div>
      </form>
    </div>
  )
}
