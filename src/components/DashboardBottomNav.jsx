import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Catalog', to: '/categories', icon: ShoppingBag },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'Profile', to: '/profile', icon: User },
]

export function DashboardBottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-7xl -translate-x-1/2 border-t border-brand-ink/10 bg-white/90 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl">
      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${
              isActive ? 'bg-brand-gold/10 text-brand-orange' : 'text-brand-ink/55'
            }`
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
