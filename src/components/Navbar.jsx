import { useState } from 'react'
import { MapPin, ShoppingBag, User, Menu, X, LogIn } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { dashboardPath } from '../lib/shopper'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Deals', to: '/deals' },
  { label: 'About', to: '/about' },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = Boolean(token && user)
  const authTarget = isAuthenticated ? dashboardPath(user) : '/login'
  const authLabel = isAuthenticated ? 'Dashboard' : 'Login'

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white">
            <MapPin size={18} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-extrabold leading-none text-brand-orange">FreshCart Africa</p>
            <p className="text-xs text-brand-ink/60">Fresh grocery commerce for fast cities</p>
          </div>
          <div className="sm:hidden">
            <p className="font-display text-base font-extrabold leading-none text-brand-orange">FreshCart</p>
            <p className="text-[10px] text-brand-ink/60">Fast grocery delivery</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-brand-orange/10 text-brand-orange' 
                    : 'text-brand-ink/65 hover:bg-brand-ink/5 hover:text-brand-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Login Button - Desktop */}
          <Link 
            to={authTarget} 
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-ink/5 px-4 py-2.5 text-sm font-semibold text-brand-ink/70 hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
          >
            {isAuthenticated ? <User size={16} /> : <LogIn size={16} />}
            <span>{authLabel}</span>
          </Link>

          {/* Login Icon - Mobile */}
          <Link 
            to={authTarget} 
            className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
            aria-label={authLabel}
          >
            {isAuthenticated ? <User size={18} /> : <LogIn size={18} />}
          </Link>

          {/* Cart Button */}
          <Link 
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/20 text-brand-orange hover:bg-brand-gold/30 transition-all" 
            to="/cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={18} />
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
              3
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink/5 text-brand-ink/70 hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-brand-ink/5 bg-white">
          <nav className="flex flex-col px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-brand-orange/10 text-brand-orange' 
                      : 'text-brand-ink/65 hover:bg-brand-ink/5 hover:text-brand-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Mobile Login Button */}
            <Link
              to={authTarget}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-brand-ink/65 hover:bg-brand-orange/10 hover:text-brand-orange transition-all"
            >
              {isAuthenticated ? <User size={18} /> : <LogIn size={18} />}
              {isAuthenticated ? 'Open dashboard' : 'Login to Account'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
