import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  PackagePlus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react'
import { NotificationBell } from '../../components/NotificationBell'
import { endpoints } from '../../lib/api'

const emptyForm = {
  name: '',
  category_id: '',
  price: '',
  stock_quantity: '',
  unit: 'piece',
  image_url: '',
  description: '',
}

export default function UploadProductPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [vendorProfile, setVendorProfile] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [categoriesResponse, profileResponse] = await Promise.all([
          endpoints.categories(),
          endpoints.vendorProfile(),
        ])
        if (cancelled) return
        setCategories(categoriesResponse.data)
        setVendorProfile(profileResponse.data)
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load product upload tools.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const imagePreview = useMemo(() => form.image_url.trim(), [form.image_url])

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await endpoints.createVendorProduct({
        name: form.name.trim(),
        category_id: Number(form.category_id),
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        unit: form.unit.trim() || 'piece',
        image_url: form.image_url.trim() || undefined,
        description: form.description.trim(),
      })
      setSuccess('Product submitted for admin approval.')
      setForm(emptyForm)
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to submit product right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isVerified = vendorProfile?.is_verified

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,-apple-system,sans-serif]">
      <div className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <PackagePlus size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Vendor Hub</span>
          </div>
          <NotificationBell
            buttonClassName="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
            iconClassName="h-5 w-5 text-gray-700"
            dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
          />
        </div>
      </div>

      <div className="px-5 py-4 pb-28">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gray-900 rounded-full"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">New Listing</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Upload Product</h1>
          <p className="text-sm text-gray-500">Submit a new product using the fields supported by the backend.</p>
        </div>

        {!isVerified ? (
          <div className="mb-5 bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Verification Pending</p>
              <p className="text-xs text-amber-700 mt-0.5">Complete your vendor verification to start listing products.</p>
            </div>
          </div>
        ) : (
          <div className="mb-5 bg-emerald-50 rounded-xl p-3 flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <p className="text-xs font-medium text-emerald-800">Verified vendor — ready to list products</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Product Image</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Paste a public image URL for this product.</p>
                </div>
                <ImageIcon size={20} className="text-gray-400" />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="relative">
                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
                />
              </div>

              <div className="aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                    onError={() => setError('The image URL could not be previewed. Please check the link.')}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={28} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Image preview</p>
                    <p className="text-xs mt-1">Add an image URL to preview the product.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Fresh oranges"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Price</label>
                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Stock Quantity</label>
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Unit</label>
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="piece"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the product, freshness, weight, or packaging."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-400"
              />
            </div>
          </div>

          {success ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{success}</div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
          ) : null}

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}>
            <div className="max-w-md mx-auto">
              <button
                type="submit"
                disabled={!isVerified || isSubmitting}
                className="w-full bg-gray-900 py-4 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-2 active:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Submit for Approval</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
