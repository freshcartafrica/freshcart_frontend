import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { dashboardPath } from '../../lib/shopper'
import { filterMarketplaceCategories } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'

export default function VendorOnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)
  
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    representativeName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    businessAddress: '',
    city: '',
    description: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    bvn: '',
    acceptedTerms: false,
  })

  useEffect(() => {
    let cancelled = false

    const loadCategories = async () => {
      try {
        const response = await endpoints.categories()
        if (!cancelled) setCategories(filterMarketplaceCategories(response.data))
      } catch {
        if (!cancelled) setError('Unable to load admin-approved categories right now.')
      }
    }

    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step < 3) setStep((prev) => prev + 1)
  }

  const handleBack = (e) => {
    e.preventDefault()
    if (step > 1) setStep((prev) => prev - 1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await endpoints.updateVendorProfile({
        business_name: formData.businessName.trim(),
        city: formData.city.trim(),
      })
      completeOnboarding({
        user,
        data: {
          role: 'vendor',
          ...formData,
        },
      })
      navigate(dashboardPath(user), { replace: true })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to save your vendor onboarding details right now.')
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        
        {/* Header Section */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-brand-orange">
            Vendor Onboarding
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-brand-ink sm:text-4xl">
            Complete your storefront setup
          </h1>
          <p className="mt-3 text-sm text-brand-ink/50 max-w-lg mx-auto leading-relaxed">
            Every vendor must submit business and payout details before inventory and order tools are unlocked.
          </p>
        </div>

        {/* Stepper Indicators */}
        <div className="mt-10 flex justify-between items-center max-w-md mx-auto relative">
          {/* Progress Bar Track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-ink/10 -z-0"></div>
          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-orange transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 border-2 ${
                step === s 
                  ? 'bg-white border-brand-orange text-brand-orange ring-4 ring-brand-orange/10' 
                  : step > s 
                  ? 'bg-brand-orange border-brand-orange text-white'
                  : 'bg-white border-brand-ink/15 text-brand-ink/40'
              }`}
            >
              {step > s ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 8" />
                </svg>
              ) : (
                s
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="mt-10 rounded-3xl border border-brand-ink/5 bg-white p-6 shadow-2xl shadow-brand-ink/5 sm:p-10">
          <form className="space-y-6" onSubmit={step === 3 ? handleSubmit : handleNext}>
            {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
            
            {/* STEP 1: Business Details */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-brand-ink">Business Details</h2>
                  <p className="text-xs text-brand-ink/40">Provide your basic business information</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Business Name
                    </label>
                    <input 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. Green Valley Farm"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Business Type
                    </label>
                    <select 
                      name="businessType" 
                      value={formData.businessType} 
                      onChange={handleChange} 
                      required 
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10"
                    >
                      <option value="">Select admin-approved category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Representative Name
                    </label>
                    <input 
                      name="representativeName" 
                      value={formData.representativeName} 
                      onChange={handleChange} 
                      required 
                      placeholder="Full Name"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Store Description
                    </label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      required 
                      rows="3" 
                      placeholder="Briefly describe what your store offers..."
                      className="mt-2 w-full resize-none rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Information */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-brand-ink">Contact Information</h2>
                  <p className="text-xs text-brand-ink/40">Where can customers and logistics reach your business?</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Business Email
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="hello@store.com"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Phone Number
                    </label>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      City
                    </label>
                    <input 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                      placeholder="Your City"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Business Address
                    </label>
                    <input 
                      name="businessAddress" 
                      value={formData.businessAddress} 
                      onChange={handleChange} 
                      required 
                      placeholder="Full street address"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payout Details & Verification */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-brand-ink">Payout & Verification</h2>
                  <p className="text-xs text-brand-ink/40">Secure details for processing your store's earnings</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Bank Name
                    </label>
                    <input 
                      name="bankName" 
                      value={formData.bankName} 
                      onChange={handleChange} 
                      required 
                      placeholder="Your Bank"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Account Number
                    </label>
                    <input 
                      name="accountNumber" 
                      value={formData.accountNumber} 
                      onChange={handleChange} 
                      required 
                      placeholder="0012345678"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      Account Name
                    </label>
                    <input 
                      name="accountName" 
                      value={formData.accountName} 
                      onChange={handleChange} 
                      required 
                      placeholder="Account holder's full name"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-ink/40">
                      BVN (Bank Verification Number)
                    </label>
                    <input 
                      name="bvn" 
                      value={formData.bvn} 
                      onChange={handleChange} 
                      required 
                      placeholder="11-digit BVN"
                      className="mt-2 w-full rounded-2xl border border-brand-ink/10 bg-brand-cream/30 px-4 py-3.5 text-sm text-brand-ink outline-none transition-all focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-ink/30" 
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border-t border-brand-ink/5 pt-4 mt-6">
                  <label className="flex items-start gap-4 rounded-xl bg-brand-cream/30 p-4 text-xs leading-5 text-brand-ink/80 ring-1 ring-brand-ink/5 sm:text-sm">
                    <input 
                      type="checkbox" 
                      name="acceptedTerms" 
                      checked={formData.acceptedTerms} 
                      onChange={handleChange} 
                      required 
                      className="mt-1 h-4 w-4 rounded border-brand-ink/20 text-brand-orange accent-brand-orange focus:ring-0 focus:ring-offset-0" 
                    />
                    <span>
                      I confirm all vendor onboarding information is complete and understand that dashboard access
                      stays locked until submission.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step Navigation Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-brand-ink/5 pt-6 sm:flex-row sm:justify-between">
              
              {step > 1 ? (
                <button 
                  className="w-full rounded-2xl border border-brand-ink/10 px-6 py-3.5 text-center text-sm font-semibold text-brand-ink transition-all hover:bg-brand-cream/20 sm:w-auto" 
                  type="button" 
                  onClick={handleBack}
                >
                  Back
                </button>
              ) : (
                <button 
                  className="w-full rounded-2xl border border-brand-ink/10 px-6 py-3.5 text-center text-sm font-semibold text-brand-ink transition-all hover:bg-brand-cream/20 sm:w-auto" 
                  type="button" 
                  onClick={() => navigate('/')}
                >
                  Exit to Home
                </button>
              )}

              {step < 3 ? (
                <button 
                  className="w-full rounded-2xl bg-brand-orange px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange/90 sm:w-auto" 
                  type="submit"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button 
                  className="w-full rounded-2xl bg-brand-orange px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange/90 sm:w-auto" 
                  type="submit"
                >
                  Submit Vendor Onboarding
                </button>
              )}
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}
