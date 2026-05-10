import { BarChart3, Plus, ShieldCheck, Store, Trash2, Users2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NotificationBell } from '../../components/NotificationBell'
import { endpoints } from '../../lib/api'
import { filterMarketplaceCategories, starterCategoryDefinitions, starterCategoryImage } from '../../lib/shopper'
import { formatCurrency } from '../../lib/shopperDashboard'

const emptyCategory = { name: '', image_url: '' }

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null)
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])
  const [pendingProducts, setPendingProducts] = useState([])
  const [categoryForm, setCategoryForm] = useState(emptyCategory)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    const [analyticsResponse, categoriesResponse, vendorsResponse, pendingProductsResponse] = await Promise.all([
      endpoints.adminAnalytics(),
      endpoints.categories(),
      endpoints.adminVendors(),
      endpoints.adminPendingProducts(),
    ])
    setAnalytics(analyticsResponse.data)
    setCategories(filterMarketplaceCategories(categoriesResponse.data))
    setVendors(vendorsResponse.data)
    setPendingProducts(pendingProductsResponse.data)
  }

  useEffect(() => {
    let cancelled = false

    const boot = async () => {
      try {
        await load()
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load admin dashboard.')
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const handleCreateCategory = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    try {
      await endpoints.createCategory({
        name: categoryForm.name.trim(),
        image_url: categoryForm.image_url.trim() || starterCategoryImage(categoryForm.name),
      })
      setCategoryForm(emptyCategory)
      setSuccess('Category added successfully.')
      await load()
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to create category.')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    setError('')
    setSuccess('')
    try {
      await endpoints.deleteCategory(categoryId)
      setSuccess('Category removed.')
      await load()
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to delete category.')
    }
  }

  return (
    <div className="space-y-6">
      <header className="surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-brand-ink/55">Admin dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Marketplace oversight and approvals.</h1>
          </div>
          <NotificationBell
            buttonClassName="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream text-brand-ink"
            iconClassName="h-5 w-5"
            dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white"
          />
        </div>
      </header>

      {error ? <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">{error}</div> : null}
      {success ? <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{success}</div> : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total orders', analytics?.total_orders ?? '--', BarChart3],
          ['Revenue', analytics ? formatCurrency(analytics.total_revenue) : '--', Store],
          ['Active users', analytics?.active_users ?? '--', Users2],
          ['Pending reviews', pendingProducts.length + vendors.filter((vendor) => !vendor.is_verified).length, ShieldCheck],
        ].map(([label, value, Icon]) => (
          <div key={label} className="surface p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <Icon size={18} />
            </div>
            <p className="mt-4 text-sm text-brand-ink/55">{label}</p>
            <p className="mt-2 text-3xl font-extrabold text-brand-blue">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">Admin navigation</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['/admin/orders', 'Admin orders', 'Review all marketplace orders.'],
              ['/admin/vendors', 'Admin vendors', 'Approve vendor registrations and inspect stores.'],
              ['/admin/users', 'Admin users', 'View shoppers, vendors, and admins.'],
              ['/admin/verification', 'Admin verification', 'Approve pending products and vendors.'],
              ['/admin/tracking', 'Admin tracking', 'Monitor order and delivery status.'],
              ['/admin/riders', 'Admin riders', 'Placeholder rider operations hub.'],
            ].map(([to, title, copy]) => (
              <Link key={to} className="rounded-[24px] bg-brand-cream p-4 transition hover:-translate-y-0.5" to={to}>
                <p className="font-bold text-brand-ink">{title}</p>
                <p className="mt-2 text-sm text-brand-ink/60">{copy}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Category management</h2>
          <form className="mt-5 grid gap-3" onSubmit={handleCreateCategory}>
            <select value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" required>
              <option value="">Select starter category</option>
              {starterCategoryDefinitions.map((category) => (
                <option key={category.key} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input value={categoryForm.image_url} onChange={(event) => setCategoryForm((current) => ({ ...current, image_url: event.target.value }))} className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Category image URL" />
            <button className="primary-button inline-flex items-center justify-center gap-2">
              <Plus size={16} />
              Add category
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-[20px] bg-brand-cream p-4">
                <div>
                  <p className="font-bold text-brand-ink">{category.name}</p>
                  <p className="text-sm text-brand-ink/55">{category.slug}</p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500" onClick={() => handleDeleteCategory(category.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
