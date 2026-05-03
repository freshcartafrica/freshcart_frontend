import { formatCurrency, vendorOrders } from '../../data/mockData'

export default function VendorOrdersPage() {
  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Vendor orders</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Fulfillment queue for the day.</h1>

      <div className="mt-8 space-y-4">
        {vendorOrders.map((order) => (
          <article key={order.id} className="rounded-[28px] bg-brand-cream p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-brand-ink">{order.id}</p>
                <p className="text-sm text-brand-ink/55">{order.customer}</p>
              </div>
              <p className="font-bold text-brand-blue">{formatCurrency(order.value)}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-brand-ink/55">{order.items} items to fulfill</span>
              <span className="font-semibold text-brand-orange">{order.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
