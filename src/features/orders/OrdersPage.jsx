import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Filter,
  Package,
  Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import {
  formatCurrency,
  formatOrderNumber,
  orderStatusMeta,
} from '../../lib/shopperDashboard'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await endpoints.orders()
        if (!cancelled) setOrders(response.data)
      } catch {
        if (!cancelled) setError('Unable to load order history.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const tabs = ['all', 'active', 'delivered', 'pending']
  const visibleOrders = useMemo(() => {
    if (activeTab === 'all') return orders
    if (activeTab === 'active') return orders.filter((order) => order.status !== 'delivered')
    return orders.filter((order) => order.status === activeTab)
  }, [activeTab, orders])

  return (
    <div className="w-full min-h-screen bg-white pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-2 py-2">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-[15px] font-extrabold text-neutral-900">Order History</h1>
              <p className="text-[12px] text-neutral-400">{orders.length} orders</p>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100">
              <Search className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 pt-2">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-shrink-0 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all ${activeTab === tab ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-neutral-600">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-neutral-600">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="space-y-3">
          {visibleOrders.map((order) => {
            const status = orderStatusMeta(order.status)
            return (
              <button
                key={order.id}
                className="w-full rounded-2xl border border-neutral-200/60 bg-white p-4 text-left"
                onClick={() => navigate(`/track-rider/${order.id}`)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">{formatOrderNumber(order.id)}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.chip}`}>{status.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(order.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-0.5 text-xs text-neutral-400">Total Amount</p>
                    <p className="text-base font-extrabold text-neutral-900">{formatCurrency(order.total_amount)}</p>
                  </div>
                  <span className={`text-xs font-bold ${status.accent}`}>View Tracking</span>
                </div>
              </button>
            )
          })}
        </div>

        {!visibleOrders.length ? (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
            <h3 className="mb-2 text-lg font-bold text-neutral-900">No Orders Yet</h3>
            <p className="mb-6 text-sm text-neutral-400">Start shopping to see your orders here</p>
            <button className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white" onClick={() => navigate('/categories')}>
              Browse Products
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
