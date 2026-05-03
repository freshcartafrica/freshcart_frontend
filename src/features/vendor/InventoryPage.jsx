import { inventory } from '../../data/mockData'

export default function InventoryPage() {
  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Inventory management</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">Watch stock levels before they become fulfillment problems.</h1>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-brand-ink/10">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 bg-brand-cream px-4 py-3 text-sm font-bold text-brand-ink">
          <span>Product</span>
          <span>Stock</span>
          <span>Threshold</span>
          <span>Status</span>
        </div>
        {inventory.map((item) => (
          <div key={item.sku} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-t border-brand-ink/10 bg-white px-4 py-4 text-sm">
            <div>
              <p className="font-bold text-brand-ink">{item.name}</p>
              <p className="text-brand-ink/50">{item.sku}</p>
            </div>
            <span className="font-semibold text-brand-ink">{item.stock}</span>
            <span className="text-brand-ink/60">{item.threshold}</span>
            <span className={`font-semibold ${item.status === 'Healthy' ? 'text-emerald-600' : item.status === 'Low' ? 'text-amber-600' : 'text-red-500'}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
