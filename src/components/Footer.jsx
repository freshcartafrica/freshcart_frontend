import { Link } from 'react-router-dom'

const footerGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Landing page', to: '/' },
      { label: 'Product listing', to: '/products' },
      { label: 'Deals', to: '/deals' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    title: 'Shopper',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Cart', to: '/cart' },
      { label: 'Checkout', to: '/checkout' },
      { label: 'Order history', to: '/orders' },
    ],
  },
  {
    title: 'Marketplace',
    links: [
      { label: 'Vendor dashboard', to: '/vendor' },
      { label: 'Vendor orders', to: '/vendor/orders' },
      { label: 'Inventory', to: '/vendor/inventory' },
      { label: 'Admin dashboard', to: '/admin' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-ink/10 bg-brand-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-gold">Footer</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold">FreshCart Africa</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            A grocery marketplace concept with marketing pages, shopper flows, vendor tools and admin views designed as one product system.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-bold text-white">{group.title}</p>
              <div className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <Link key={link.to} className="block text-sm text-white/65 hover:text-brand-gold" to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
