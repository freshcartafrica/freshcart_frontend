import {
  ArrowLeft,
  Check,
  ChevronRight,
  Home,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import {
  formatCurrency,
  formatOrderNumber,
  orderStatusMeta,
} from '../../lib/shopperDashboard'

export default function TrackOrderPage() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await endpoints.order(orderId)
        if (!cancelled) setOrder(response.data)
      } catch {
        if (!cancelled) setError('Unable to load order tracking.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [orderId])

  const trackingSteps = useMemo(() => {
    const statusOrder = ['pending', 'confirmed', 'out_for_delivery', 'delivered']
    const currentIndex = Math.max(statusOrder.indexOf(order?.status), 0)
    return [
      { key: 'pending', title: 'Order Confirmed', icon: <Check className="h-5 w-5" /> },
      { key: 'confirmed', title: 'Preparing', icon: <Package className="h-5 w-5" /> },
      { key: 'out_for_delivery', title: 'Out for Delivery', icon: <Truck className="h-5 w-5" /> },
      { key: 'delivered', title: 'Delivered', icon: <Home className="h-5 w-5" /> },
    ].map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }, [order])

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] px-4 py-6 font-['Manrope']">
        <button className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50" onClick={() => navigate('/history')}>
          <ArrowLeft className="h-5 w-5 text-neutral-800" />
        </button>
        <p className="text-sm text-neutral-500">{error || 'Loading tracking details...'}</p>
      </div>
    )
  }

  const status = orderStatusMeta(order.status)

  return (
    <div className="w-full min-h-screen bg-[#fdfaf6] pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100" onClick={() => navigate('/history')}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] font-extrabold text-neutral-900">Track Order</h1>
              <p className="text-[12px] text-neutral-400">{formatOrderNumber(order.id)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 shadow-lg shadow-orange-500/20">
          <div className="text-center">
            <p className="mb-1 text-sm font-medium text-white/70">Current Status</p>
            <p className="mb-1 text-4xl font-black text-white">{status.label}</p>
            <p className="text-sm text-white/80">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-neutral-200/60 bg-white p-4">
          <h3 className="mb-4 text-sm font-bold text-neutral-900">Order Progress</h3>
          <div className="space-y-0">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step.completed ? 'bg-orange-500 text-white' : step.current ? 'border-2 border-orange-500 bg-orange-100 text-orange-500' : 'bg-neutral-100 text-neutral-400'}`}>
                    {step.icon}
                  </div>
                  {index < trackingSteps.length - 1 ? <div className={`h-12 w-0.5 ${step.completed ? 'bg-orange-500' : 'bg-neutral-200'}`} /> : null}
                </div>
                <div className={index === trackingSteps.length - 1 ? '' : 'pb-8'}>
                  <p className={`text-sm font-bold ${step.current ? 'text-orange-600' : 'text-neutral-900'}`}>{step.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-neutral-200/60 bg-white p-4">
          <h3 className="mb-3 text-sm font-bold text-neutral-900">Order Summary</h3>
          {order.items.map((item) => (
            <div key={`${order.id}-${item.product_name}`} className="mb-3 flex items-center gap-3 last:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-900">{item.product_name}</p>
                <p className="text-xs text-neutral-400">
                  {item.quantity}x • {formatCurrency(item.unit_price)}
                </p>
              </div>
              <span className="text-sm font-extrabold text-orange-600">{formatCurrency(item.unit_price * item.quantity)}</span>
            </div>
          ))}
          <button className="mt-2 flex w-full items-center justify-between text-sm font-bold text-orange-600" onClick={() => navigate('/history')}>
            View All Orders
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-bold text-neutral-900">Delivery Address</p>
              <p className="mt-0.5 text-xs text-neutral-400">{order.delivery_address}</p>
              <p className="mt-2 text-xs font-semibold text-neutral-500">Payment method: {order.payment_method.replaceAll('_', ' ')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
