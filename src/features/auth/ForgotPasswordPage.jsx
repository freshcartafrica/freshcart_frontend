import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      const response = await endpoints.forgotPassword({ email: email.trim() })
      setMessage(response.data.message || 'Reset instructions have been sent if the account exists.')
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to process that request right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-[#222] shadow-2xl overflow-hidden flex flex-col md:flex-row relative rounded-none md:rounded-2xl">
        
        {/* Left Hero Section / Side Banner on Desktop */}
        <div className="w-full md:w-1/2 h-[220px] md:h-auto bg-gradient-to-b md:bg-gradient-to-br from-amber-700/60 to-transparent md:from-amber-700/40 md:to-amber-950/80 flex flex-col justify-between p-6 md:p-10 z-0 relative min-h-[220px] md:min-h-[500px]">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/login')} 
            className="flex items-center text-white/90 text-xs font-semibold gap-2 hover:text-white transition-colors mt-2 md:mt-0 self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to login
          </button>

          <div className="hidden md:flex flex-col text-white max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mb-2">Need Help?</span>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Recover your access securely</h1>
            <p className="text-white/60 text-xs leading-relaxed">Don't worry, we'll send you instructions to get back into your account in no time.</p>
          </div>
        </div>

        {/* Right Modal / Information Sheet */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-between z-10 shadow-2xl rounded-t-[32px] md:rounded-r-2xl md:rounded-t-none min-h-[460px] md:min-h-[500px]">
          <div>
            {/* Drag Handle for mobile */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6 md:hidden"></div>

            {/* Header */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password</h2>
            <p className="text-slate-500 mt-1 text-xs leading-relaxed">Enter the email address associated with your account.</p>

            {/* Form */}
            <form className="space-y-5 mt-7" onSubmit={handleSubmit}>
              {message ? <p className="text-xs font-medium text-emerald-600">{message}</p> : null}
              {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
              {/* Email Address Input */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com" 
                    autoComplete="email"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xs rounded-xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div>
            <div className="relative flex items-center py-3 border-t border-slate-100 mt-6">
              <span className="text-center w-full text-slate-400 text-[10px]">
                Suddenly remembered?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')} 
                  className="text-orange-600 font-semibold hover:text-orange-500 transition-colors underline-offset-4 hover:underline"
                >
                  Log in here
                </button>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
