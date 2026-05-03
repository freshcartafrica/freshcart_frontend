import { Box, ClipboardList, LayoutDashboard, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency, inventory, vendorOrders, vendorProfile } from '../../data/mockData'

export default function VendorPage() {
  return (
    <div className="space-y-6">
      <header className="surface overflow-hidden bg-brand-blue p-6 text-white">
        <p className="text-sm text-white/70">Vendor dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">{vendorProfile.name}</h1>
        <p className="mt-3 text-white/75">{vendorProfile.specialty}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-4">
        {[
          ['Open orders', `${vendorOrders.length}`, LayoutDashboard],
          ['Inventory SKUs', `${inventory.length}`, Box],
          ['Fill rate', '97%', ClipboardList],
          ['Vendor rating', `${vendorProfile.rating}/5`, Store],
        ].map(([label, value, Icon]) => (
          <div key={label} className="surface p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
              <Icon size={18} />
            </div>
            <p className="mt-4 text-sm text-brand-ink/55">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-ink">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-brand-ink">Vendor tools</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {[
              ['/vendor/profile', 'Vendor profile', 'Store info, contact details and trust signals.'],
              ['/vendor/upload-product', 'Upload product', 'Add new SKUs, media and pricing.'],
              ['/vendor/inventory', 'Inventory management', 'Monitor stock, thresholds and restocks.'],
              ['/vendor/orders', 'Vendor orders', 'Review packing and dispatch statuses.'],
            ].map(([to, title, copy]) => (
              <Link key={to} className="rounded-[24px] bg-brand-cream p-4 transition hover:-translate-y-0.5" to={to}>
                <p className="font-bold text-brand-ink">{title}</p>
                <p className="mt-2 text-sm text-brand-ink/60">{copy}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Today&apos;s vendor orders</h2>
          <div className="mt-5 space-y-3">
            {vendorOrders.map((order) => (
              <div key={order.id} className="rounded-[24px] bg-brand-cream p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-ink">{order.id}</p>
                    <p className="text-sm text-brand-ink/55">{order.customer}</p>
                  </div>
                  <p className="font-bold text-brand-blue">{formatCurrency(order.value)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-brand-ink/55">{order.items} items</span>
                  <span className="font-semibold text-brand-orange">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
