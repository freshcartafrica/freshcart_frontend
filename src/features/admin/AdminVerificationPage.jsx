import { useEffect, useState } from 'react'
import { endpoints } from '../../lib/api'

export default function AdminVerificationPage() {
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    const [vendorsResponse, productsResponse] = await Promise.all([
      endpoints.adminVendors(),
      endpoints.adminPendingProducts(),
    ])
    setVendors(vendorsResponse.data.filter((vendor) => !vendor.is_verified))
    setProducts(productsResponse.data)
  }

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        await load()
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load verification queue.')
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface p-6">
        <p className="text-sm text-brand-ink/55">Admin verification</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-brand-ink">Pending vendor approvals.</h1>
        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
        <div className="mt-6 space-y-3">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="rounded-[24px] bg-brand-cream p-4">
              <p className="font-bold text-brand-ink">{vendor.business_name}</p>
              <p className="text-sm text-brand-ink/55">{vendor.user?.email}</p>
              <button className="primary-button mt-4" onClick={async () => {
                await endpoints.approveVendor(vendor.id)
                await load()
              }}>
                Approve vendor
              </button>
            </div>
          ))}
          {!vendors.length ? <p className="text-sm text-brand-ink/55">No vendors waiting for review.</p> : null}
        </div>
      </section>

      <section className="surface p-6">
        <p className="text-sm text-brand-ink/55">Admin verification</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-brand-ink">Pending product approvals.</h2>
        <div className="mt-6 space-y-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-[24px] bg-brand-cream p-4">
              <p className="font-bold text-brand-ink">{product.name}</p>
              <p className="text-sm text-brand-ink/55">{product.category.name}</p>
              <div className="mt-4 flex gap-3">
                <button className="primary-button" onClick={async () => {
                  await endpoints.approveProduct(product.id)
                  await load()
                }}>
                  Approve product
                </button>
                <button className="rounded-[20px] border border-red-200 px-4 py-2 text-sm font-bold text-red-500" onClick={async () => {
                  await endpoints.rejectProduct(product.id)
                  await load()
                }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
          {!products.length ? <p className="text-sm text-brand-ink/55">No products waiting for review.</p> : null}
        </div>
      </section>
    </div>
  )
}
