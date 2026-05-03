import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { authLandingPath } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'
import { finalizeSession } from './authFlow'

export default function SignUp() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const resetOnboarding = useAuthStore((state) => state.resetOnboarding)
  const [role, setRole] = useState('customer')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    acceptedTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await endpoints.register({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: role === 'vendor' ? 'vendor' : 'user',
        business_name: role === 'vendor' ? formData.businessName.trim() : undefined,
      })

      await finalizeSession({
        email: formData.email.trim(),
        password: formData.password,
        setSession,
        navigate,
        onResolvedUser: async (user) => resetOnboarding(user),
        resolvePath: (user) => authLandingPath(user),
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to create your account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-[#222] shadow-2xl overflow-hidden flex flex-col md:flex-row relative rounded-none md:rounded-2xl">
        
        {/* Left Hero Section / Side Banner on Desktop */}
        <div className="w-full md:w-1/2 h-[220px] md:h-auto bg-gradient-to-b md:bg-gradient-to-br from-amber-700/60 to-transparent md:from-amber-700/40 md:to-amber-950/80 flex flex-col justify-between p-6 md:p-10 z-0 relative min-h-[220px] md:min-h-[540px]">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-white/90 text-xs font-semibold gap-2 hover:text-white transition-colors mt-2 md:mt-0 self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          <div className="hidden md:flex flex-col text-white max-w-xs">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mb-2">Join Our Ecosystem</span>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Connect, Grow, and Thrive</h1>
            <p className="text-white/60 text-xs leading-relaxed">Access fresh produce or sell your farm harvests directly to thousands of customers.</p>
          </div>
        </div>

        {/* Right / Bottom Modal Sheet */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-between z-10 shadow-2xl rounded-t-[32px] md:rounded-r-2xl md:rounded-t-none min-h-[480px] md:min-h-[540px]">
          <div>
            {/* Drag Handle for mobile */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6 md:hidden"></div>

            {/* Header */}
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-1 text-xs leading-relaxed">Join the harvest and get fresh produce delivered.</p>

            {/* Form */}
            <form className="space-y-3 mt-5" onSubmit={handleSubmit}>
              {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
              
              {/* Account Role Selection */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                      role === 'customer'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 font-bold shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>🛒</span> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                      role === 'vendor'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-600 font-bold shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>🌾</span> Vendor
                  </button>
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com" 
                    autoComplete="email"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400" 
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644 10.9 10.9 0 0118.928 0 1.012 1.012 0 010 .644A10.9 10.9 0 012.036 12.322z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {role === 'vendor' ? (
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Green Farm Produce"
                    required
                    className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              ) : null}

              {/* Terms and Conditions */}
              <div className="flex items-center text-[9px] text-slate-500 py-1 select-none">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  required
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 mr-2 w-3.5 h-3.5"
                />
                <span>I agree to the Terms & Conditions and Privacy Policy.</span>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xs rounded-xl shadow-xl shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-2 mt-1"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>
          </div>

          {/* Footer/Navigation Links */}
          <div>
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-slate-400 text-[8px] tracking-widest uppercase">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-2">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="text-orange-600 font-semibold hover:text-orange-500 transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
