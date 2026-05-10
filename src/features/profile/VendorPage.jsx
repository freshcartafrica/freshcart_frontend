import {
  Box,
  History,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Store,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NotificationBell } from '../../components/NotificationBell'
import { endpoints } from '../../lib/api'
import { formatCurrency, formatOrderNumber, orderStatusMeta } from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function VendorDashboard() {
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const clearSession = useAuthStore((state) => state.clearSession)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const profileResponse = await endpoints.vendorProfile()
        if (cancelled) return

        const vendorProfile = profileResponse.data
        setProfile(vendorProfile)

        const [productsRes, ordersRes] = await Promise.allSettled([
          endpoints.vendorProducts(),
          vendorProfile.is_verified ? endpoints.vendorOrders() : Promise.resolve({ data: [] }),
        ])

        if (cancelled) return

        if (productsRes.status === 'fulfilled') {
          setProducts(productsRes.value.data)
        }

        if (ordersRes.status === 'fulfilled') {
          setOrders(ordersRes.value.data)
        } else {
          setOrders([])
        }
      } catch (err) {
        if (!cancelled) console.error('Dashboard failed to load', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const grossSales = useMemo(() => orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0), [orders])
  const activeProducts = useMemo(() => products.filter(p => p.is_active), [products])
  const pendingProducts = useMemo(() => products.filter(p => !p.is_active), [products])
  const latestOrder = orders[0]
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending').length, [orders])
  const deliveredOrders = useMemo(() => orders.filter(o => o.status === 'delivered').length, [orders])

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders.slice(0, 5)
    return orders.filter(o => 
      o.id.toString().includes(searchQuery) || 
      o.delivery_address?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  }, [orders, searchQuery])

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin"></div>
          <p className="text-sm font-medium text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-['Inter',system-ui,-apple-system,sans-serif] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-md">
                  <span className="text-base font-bold text-white">
                    {profile?.business_name?.charAt(0) || 'V'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-gray-900">
                    {profile?.business_name || 'Vendor'}
                  </h1>
                  <div className={`px-1.5 py-0.5 rounded-full ${profile?.is_verified ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <span className={`text-[9px] font-bold ${profile?.is_verified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {profile?.is_verified ? '✓' : '•'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{profile?.city || 'Store location pending'}</p>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
              >
                <Search size={18} className="text-gray-600" />
              </button>
              <NotificationBell
                buttonClassName="relative w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
                iconClassName="h-[18px] w-[18px] text-gray-600"
                dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
              />
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {showSearch && (
            <div className="mt-3 pb-2 animate-slide-down">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders by ID or address..."
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-300 transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-4">
        {/* Welcome Banner */}
        <div className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
          <p className="text-xs text-gray-300 font-medium mb-1">Welcome back,</p>
          <p className="text-lg font-bold">{profile?.business_name?.split(' ')[0] || 'Vendor'}!</p>
          <p className="text-xs text-gray-300 mt-1">You have {pendingOrders} pending orders to fulfill</p>
          <Link 
            to="/vendor/orders" 
            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-white/80 hover:text-white"
          >
            View orders
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Revenue</span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(grossSales)}</p>
            <p className="text-[10px] text-gray-400 mt-1">Total sales</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Products</span>
              <Package size={14} className="text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900">{activeProducts.length}</p>
            <p className="text-[10px] text-gray-400 mt-1">Active listings</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Pending</span>
              <Clock size={14} className="text-amber-500" />
            </div>
            <p className="text-xl font-bold text-amber-600">{pendingOrders}</p>
            <p className="text-[10px] text-gray-400 mt-1">Orders to process</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Delivered</span>
              <Package size={14} className="text-blue-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">{deliveredOrders}</p>
            <p className="text-[10px] text-gray-400 mt-1">Completed orders</p>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            <Link 
              to="/vendor/upload-product"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gray-900 rounded-xl text-white text-sm font-medium active:bg-gray-800"
            >
              <Plus size={16} />
              Add Product
            </Link>
            <Link 
              to="/vendor/inventory"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium active:bg-gray-50"
            >
              <Box size={16} />
              Inventory
            </Link>
            <Link 
              to="/vendor/orders"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium active:bg-gray-50"
            >
              <History size={16} />
              Orders
            </Link>
            <Link 
              to="/vendor/profile"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium active:bg-gray-50"
            >
              <Store size={16} />
              Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium active:bg-red-100"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>

        {/* Wallet Section - Featured */}
        <div className="mb-6 bg-gray-900 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <span className="text-xs font-medium text-white/60">Available Balance</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">Live</span>
          </div>
          <p className="text-3xl font-bold text-white mb-4">{formatCurrency(grossSales)}</p>
          <div className="flex gap-3">
            <Link 
              to="/vendor/orders"
              className="flex-1 bg-white text-gray-900 py-2.5 rounded-xl text-sm font-semibold text-center active:bg-gray-100"
            >
              Orders
            </Link>
            <Link 
              to="/vendor/inventory"
              className="flex-1 bg-white/10 text-white py-2.5 rounded-xl text-sm font-semibold text-center active:bg-white/20"
            >
              Inventory
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/vendor/orders" className="text-xs font-medium text-gray-400 hover:text-gray-600">
              View all
            </Link>
          </div>
          
          {filteredOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const statusMeta = orderStatusMeta(order.status)
                return (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Order #{formatOrderNumber(order.id)}
                          </p>
                          <p className="text-xs text-gray-400">{order.items.length} items</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusMeta.chip}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 line-clamp-1 flex-1 mr-2">
                        {order.delivery_address}
                      </p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(order.total_amount)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
              <Package size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          )}
        </div>

        {/* Products Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Product Status</h3>
            <Link to="/vendor/inventory" className="text-xs font-medium text-gray-400 hover:text-gray-600">
              Manage
            </Link>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
              <div>
                <p className="text-xs text-gray-400">Active Products</p>
                <p className="text-xl font-bold text-gray-900">{activeProducts.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending Approval</p>
                <p className="text-xl font-bold text-amber-600">{pendingProducts.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
            
            {/* Mini progress bar */}
            {activeProducts.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span>Listed</span>
                  <span>{Math.round((activeProducts.length / products.length) * 100) || 0}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(activeProducts.length / products.length) * 100 || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-bottom">
        <div className="flex items-center justify-around py-2">
          <BottomNavItem icon={LayoutDashboard} label="Home" to="/vendor" active={location.pathname === '/vendor'} />
          <BottomNavItem icon={Package} label="Orders" to="/vendor/orders" active={location.pathname === '/vendor/orders'} />
          <BottomNavItem icon={Box} label="Inventory" to="/vendor/inventory" active={location.pathname === '/vendor/inventory'} />
          <BottomNavItem icon={Store} label="Store" to="/vendor/profile" active={location.pathname === '/vendor/profile'} />
        </div>
      </nav>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/vendor/upload-product')}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-gray-900 shadow-lg flex items-center justify-center active:bg-gray-800 transition-colors z-40"
      >
        <Plus size={22} className="text-white" />
      </button>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
      `}</style>
    </div>
  )
}

function BottomNavItem({ icon: Icon, label, to, active = false }) {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
        active ? 'text-gray-900' : 'text-gray-400'
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
