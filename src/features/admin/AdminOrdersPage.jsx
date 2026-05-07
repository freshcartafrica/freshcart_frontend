import { useEffect, useState } from 'react'
import { endpoints } from '../../lib/api'
import { formatCurrency } from '../../lib/shopperDashboard'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await endpoints.adminOrders()
        if (!cancelled) setOrders(response.data)
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load admin orders.')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Admin orders</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Marketplace order history.</h1>
      {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[24px] bg-brand-cream p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-ink">Order #{order.id}</p>
                <p className="text-sm text-brand-ink/55">{order.delivery_address}</p>
              </div>
              <p className="font-bold text-brand-blue">{formatCurrency(order.total_amount)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-brand-ink/55">{order.items.length} items</span>
              <span className="font-semibold capitalize text-brand-orange">{String(order.status).replaceAll('_', ' ')}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
