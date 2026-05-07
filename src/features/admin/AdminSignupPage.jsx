import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

export default function AdminSignupPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await endpoints.register({ ...form, role: 'admin' })
      const tokenResponse = await endpoints.login({ email: form.email, password: form.password })
      const token = tokenResponse.data.access_token
      setSession({ token, user: null })
      const me = await endpoints.me()
      setSession({ token, user: me.data })
      navigate('/admin', { replace: true })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to create admin account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <form className="surface w-full max-w-md p-8" onSubmit={handleSubmit}>
        <p className="text-sm text-brand-ink/55">Admin signup</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Create admin account</h1>
        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
        <div className="mt-6 grid gap-4">
          <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Full name" value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} required />
          <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Admin email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          <button className="primary-button">{isSubmitting ? 'Creating...' : 'Create admin account'}</button>
        </div>
      </form>
    </div>
  )
}
