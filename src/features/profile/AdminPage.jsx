import { BarChart3, ShieldCheck, Store, Users2 } from 'lucide-react'
import { adminMetrics, topVendors } from '../../data/mockData'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <header className="surface p-6 sm:p-8">
        <p className="text-sm text-brand-ink/55">Admin dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Marketplace pulse and operational health.</h1>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <div key={metric.label} className="surface p-5">
            <p className="text-sm text-brand-ink/55">{metric.label}</p>
            <p className="mt-3 text-3xl font-extrabold text-brand-blue">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="surface p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Platform oversight</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ['Vendor compliance', '92% in good standing', ShieldCheck],
              ['Topline growth', '+18% month over month', BarChart3],
              ['Active customers', '6,420 weekly', Users2],
            ].map(([title, copy, Icon]) => (
              <div key={title} className="rounded-[24px] bg-brand-cream p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange">
                  <Icon size={16} />
                </div>
                <p className="mt-4 font-bold text-brand-ink">{title}</p>
                <p className="mt-2 text-sm text-brand-ink/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-2xl font-extrabold text-brand-ink">Top vendors</h2>
          <div className="mt-5 space-y-3">
            {topVendors.map((vendor) => (
              <div key={vendor.name} className="flex items-center justify-between rounded-[24px] bg-brand-cream p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-orange">
                    <Store size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-ink">{vendor.name}</p>
                    <p className="text-sm text-brand-ink/55">{vendor.city}</p>
                  </div>
                </div>
                <p className="font-bold text-brand-blue">{vendor.score}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
