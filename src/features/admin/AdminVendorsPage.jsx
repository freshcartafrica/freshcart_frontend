import { useEffect, useState } from 'react'
import { endpoints } from '../../lib/api'

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    const response = await endpoints.adminVendors()
    setVendors(response.data)
  }

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        const response = await endpoints.adminVendors()
        if (!cancelled) setVendors(response.data)
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load admin vendors.')
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const handleApprove = async (vendorId) => {
    try {
      await endpoints.approveVendor(vendorId)
      await load()
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to approve vendor.')
    }
  }

  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Admin vendors</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Vendor registrations and store approvals.</h1>
      {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {vendors.map((vendor) => (
          <article key={vendor.id} className="rounded-[24px] bg-brand-cream p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-brand-ink">{vendor.business_name}</p>
                <p className="text-sm text-brand-ink/55">{vendor.user?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${vendor.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {vendor.is_verified ? 'Approved' : 'Pending'}
                </span>
                {!vendor.is_verified ? (
                  <button className="primary-button" onClick={() => handleApprove(vendor.id)}>
                    Approve
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-sm text-brand-ink/60">City: {vendor.city}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
