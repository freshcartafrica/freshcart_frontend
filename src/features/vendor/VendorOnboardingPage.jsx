import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardPath } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'

export default function VendorOnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)
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

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    completeOnboarding({
      user,
      data: {
        role: 'vendor',
        ...formData,
      },
    })
    navigate(dashboardPath(user), { replace: true })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface overflow-hidden p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-orange">Vendor onboarding</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-brand-ink">
          Complete your storefront setup before the vendor dashboard opens.
        </h1>
        <p className="mt-4 max-w-2xl text-brand-ink/60">
          Every vendor must submit business, operations, and payout details before inventory and order tools are unlocked.
        </p>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Business Name</label>
              <input name="businessName" value={formData.businessName} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Business Type</label>
              <select name="businessType" value={formData.businessType} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none">
                <option value="">Select category</option>
                <option value="farm_produce">Farm Produce Supplier</option>
                <option value="organic_foods">Organic Foods</option>
                <option value="livestock">Livestock and Dairy</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Representative Name</label>
              <input name="representativeName" value={formData.representativeName} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Business Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">City</label>
              <input name="city" value={formData.city} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Business Address</label>
              <input name="businessAddress" value={formData.businessAddress} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Store Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none resize-none" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Bank Name</label>
              <input name="bankName" value={formData.bankName} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Account Number</label>
              <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Account Name</label>
              <input name="accountName" value={formData.accountName} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">BVN</label>
              <input name="bvn" value={formData.bvn} onChange={handleChange} required className="mt-2 w-full rounded-[18px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm text-brand-ink outline-none" />
            </div>
          </section>

          <label className="flex items-start gap-3 text-sm text-brand-ink/65">
            <input type="checkbox" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} required className="mt-1 h-4 w-4 rounded border-brand-ink/20 text-brand-orange" />
            <span>I confirm all vendor onboarding information is complete and understand dashboard access stays locked until submission.</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button className="primary-button" type="submit">
              Submit vendor onboarding
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('/')}>
              Exit to home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
