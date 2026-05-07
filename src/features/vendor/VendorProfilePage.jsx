import {
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Mail,
  Store,
  Calendar,
  Edit3,
  Camera,
  Package,
  Clock,
  CheckCircle,
  ChevronRight,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NotificationBell } from '../../components/NotificationBell'
import { endpoints } from '../../lib/api'

function formatDate(dateString) {
  if (!dateString) return 'Not available'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sheet, setSheet] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const profileResponse = await endpoints.vendorProfile()
        if (cancelled) return

        const vendorProfile = profileResponse.data
        setProfile(vendorProfile)

        const [productsResponse, ordersResponse] = await Promise.allSettled([
          endpoints.vendorProducts(),
          vendorProfile.is_verified ? endpoints.vendorOrders() : Promise.resolve({ data: [] }),
        ])

        if (cancelled) return

        if (productsResponse.status === 'fulfilled') {
          setProducts(productsResponse.value.data)
        }

        if (ordersResponse.status === 'fulfilled') {
          setOrders(ordersResponse.value.data)
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load vendor profile.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(
    () => ({
      products: products.length,
      activeProducts: products.filter((item) => item.is_active).length,
      orders: orders.length,
      pendingProducts: products.filter((item) => !item.is_active).length,
    }),
    [orders, products],
  )

  const storeInfo = [
    { label: 'Business Name', value: profile?.business_name || 'Not set', icon: Store },
    { label: 'Store ID', value: profile ? `V-${profile.id}` : '--', icon: BadgeCheck },
    { label: 'Email Address', value: profile?.user?.email || 'Not set', icon: Mail },
    { label: 'Phone Number', value: profile?.user?.phone || 'Not set', icon: Phone },
    { label: 'Location', value: profile?.city || 'Not set', icon: MapPin },
    { label: 'Member Since', value: formatDate(profile?.user?.created_at), icon: Calendar },
  ]

  const settingsItems = [
    {
      id: 'store',
      label: 'Edit Store Profile',
      icon: Edit3,
      title: 'Store profile details',
      body: `Business name: ${profile?.business_name || 'Not set'}\nCity: ${profile?.city || 'Not set'}\nVerification: ${profile?.is_verified ? 'Approved' : 'Pending admin review'}`,
    },
    {
      id: 'verification',
      label: 'Verification Status',
      icon: ShieldCheck,
      title: 'Verification details',
      body: profile?.is_verified
        ? 'Your store has been approved by the admin team and your active products can appear to shoppers.'
        : 'Your store is still waiting for admin approval. Product submissions stay in review until your vendor registration is approved.',
    },
    {
      id: 'catalog',
      label: 'Catalog Summary',
      icon: Package,
      title: 'Catalog details',
      body: `Products uploaded: ${stats.products}\nActive listings: ${stats.activeProducts}\nPending approvals: ${stats.pendingProducts}`,
    },
    {
      id: 'orders',
      label: 'Order Readiness',
      icon: Clock,
      title: 'Order access details',
      body: profile?.is_verified
        ? `Your store currently has ${stats.orders} vendor orders available in the backend.`
        : 'Vendor orders are locked until the store has been approved by an admin.',
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div>
          <p className="text-sm font-medium text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-['Inter',system-ui,-apple-system,sans-serif] pb-24">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
          >
            <ChevronRight size={20} className="text-gray-700 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Store size={14} className="text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900">My Store</span>
          </div>
          <NotificationBell
            buttonClassName="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-50"
            iconClassName="h-5 w-5 text-gray-700"
            dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
          />
        </div>
      </div>

      <div className="px-5 py-4">
        {error ? (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
        ) : null}

        <div className="relative mb-6">
          <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden" />

          <div className="absolute -bottom-12 left-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profile?.business_name?.charAt(0) || 'V'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSheet({ title: 'Store avatar', body: 'Store branding images are not editable from the current backend endpoints yet.' })}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 active:bg-gray-50"
              >
                <Camera size={14} className="text-gray-600" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setSheet(settingsItems[0])}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:bg-white"
          >
            <Edit3 size={14} className="text-gray-700" />
          </button>
        </div>

        <div className="mt-14 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{profile?.business_name || 'Vendor Store'}</h1>
            {profile?.is_verified ? (
              <div className="bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <CheckCircle size={12} className="text-emerald-600" />
              </div>
            ) : (
              <div className="bg-amber-50 px-1.5 py-0.5 rounded-full">
                <Clock size={12} className="text-amber-600" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">{profile?.city || 'Store location pending'}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
              <Package size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.products}</p>
              <p className="text-[10px] text-gray-400 uppercase">Products</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
              <BadgeCheck size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.activeProducts}</p>
              <p className="text-[10px] text-gray-400 uppercase">Active</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
              <Clock size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.orders}</p>
              <p className="text-[10px] text-gray-400 uppercase">Orders</p>
            </div>
          </div>
        </div>

        {!profile?.is_verified ? (
          <div className="mb-6 bg-amber-50 rounded-xl p-4 flex items-start gap-3 border border-amber-100">
            <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Verification Pending</p>
              <p className="text-xs text-amber-700 mt-0.5">Your store is under review. Orders will unlock after admin approval.</p>
            </div>
            <button
              onClick={() => setSheet(settingsItems[1])}
              className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full"
            >
              Learn More
            </button>
          </div>
        ) : (
          <div className="mb-6 bg-emerald-50 rounded-xl p-3 flex items-center gap-2 border border-emerald-100">
            <CheckCircle size={16} className="text-emerald-600" />
            <p className="text-xs font-medium text-emerald-800">Verified store — your active products can be shown to customers</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Store Information</h3>
          <div className="space-y-3">
            {storeInfo.map((item) => (
              <button
                key={item.label}
                onClick={() => setSheet({ title: item.label, body: item.value })}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Store Settings</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {settingsItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSheet(item)}
                className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <item.icon size={14} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/vendor"
          className="block w-full bg-white border border-gray-200 rounded-xl py-3.5 text-center text-sm font-semibold text-gray-700 transition-colors active:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100">
        <div className="flex items-center justify-around py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' }}>
          <BottomNavItem icon={Store} label="Home" to="/vendor" active={location.pathname === '/vendor'} />
          <BottomNavItem icon={Package} label="Orders" to="/vendor/orders" active={location.pathname === '/vendor/orders'} />
          <BottomNavItem icon={BadgeCheck} label="Profile" to="/vendor/profile" active={location.pathname === '/vendor/profile'} />
          <BottomNavItem icon={Edit3} label="Upload" to="/vendor/upload-product" active={location.pathname === '/vendor/upload-product'} />
        </div>
      </nav>

      {sheet ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/40" onClick={() => setSheet(null)}>
          <div
            className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Details</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">{sheet.title}</h3>
              </div>
              <button onClick={() => setSheet(null)} className="rounded-full bg-gray-100 p-2 text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">{sheet.body}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function BottomNavItem({ icon: Icon, label, to, active = false }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${active ? 'text-gray-900' : 'text-gray-400'}`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
