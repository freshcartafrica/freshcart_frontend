import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardPath } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    deliveryNote: '',
    password: '',
    acceptedTerms: false,
  })

  const canContinue =
    (step === 1 &&
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.dob &&
      formData.gender) ||
    (step === 2 &&
      formData.address &&
      formData.city &&
      formData.state &&
      formData.deliveryNote) ||
    step === 3

  const stepTitle = useMemo(
    () =>
      ({
        1: 'Personal profile',
        2: 'Delivery setup',
        3: 'Security confirmation',
      })[step],
    [step],
  )

  const handleInputChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFinalSubmit = (event) => {
    event.preventDefault()
    completeOnboarding({
      user,
      data: {
        role: 'user',
        ...formData,
      },
    })
    navigate(dashboardPath(user), { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row relative rounded-none md:rounded-2xl overflow-hidden min-h-[600px] md:min-h-[650px]">
        <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-orange-500/20">FC</span>
              <span className="font-bold tracking-tight text-white">FreshCart</span>
            </div>

            <h2 className="text-2xl font-bold mb-2 tracking-tight">Customer onboarding</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              Basic account setup only. Delivery details are collected and saved during your first checkout.
            </p>

            <div className="space-y-5">
              {[
                'Personal profile',
                'Delivery details',
                'Security check',
              ].map((label, index) => (
                <div key={label} className={`flex items-center gap-3 text-xs ${step >= index + 1 ? 'text-white font-semibold' : 'text-slate-500'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border ${step >= index + 1 ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-slate-700'}`}>
                    {index + 1}
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-white text-[11px] flex items-center gap-2 mt-8 md:mt-0 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Exit to Home
          </button>
        </div>

        <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-between bg-slate-50">
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{stepTitle}</h3>
              <p className="text-slate-500 text-xs mt-1">Delivery details are saved from checkout, so this page only covers your basic account profile.</p>
            </div>

            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Delivery Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Delivery Note</label>
                  <textarea name="deliveryNote" value={formData.deliveryNote} onChange={handleInputChange} required rows="4" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs resize-none" />
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Confirm Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={6} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                </div>
                <div className="flex items-center text-[9px] text-slate-500 py-3 select-none">
                  <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleInputChange} required className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 mr-2 w-3.5 h-3.5" />
                  <span>I confirm these onboarding details are complete and I agree to the FreshCart terms.</span>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="px-5 py-2.5 border border-slate-300 text-slate-500 font-semibold text-xs rounded-xl bg-white hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(3, prev + 1))}
                  disabled={!canContinue}
                  className="px-6 py-2.5 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
                >
                  Submit onboarding
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
