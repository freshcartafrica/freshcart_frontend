import {
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NotificationBell } from '../../components/NotificationBell'
import { endpoints } from '../../lib/api'
import { addProductToCart } from '../../lib/cartActions'
import {
  activeOrderFromList,
  countCartItems,
  formatCurrency,
  formatOrderNumber,
  getProductImage,
  orderStatusMeta,
  productBadge,
} from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function FreshCartDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const [categoriesResponse, productsResponse, ordersResponse, cartResponse] = await Promise.all([
          endpoints.categories(),
          endpoints.products({ featured: true }),
          endpoints.orders(),
          endpoints.cart(),
        ])

        if (cancelled) return
        setCategories(categoriesResponse.data)
        setProducts(productsResponse.data)
        setOrders(ordersResponse.data)
        setCart(cartResponse.data)
      } catch {
        if (!cancelled) setError('Unable to load your dashboard right now.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const activeOrder = useMemo(() => activeOrderFromList(orders), [orders])
  const cartCount = useMemo(() => countCartItems(cart), [cart])
  const recommendedProducts = products.slice(0, 3)

  const addToCart = async (productId) => {
    try {
      setAddingId(productId)
      await addProductToCart({
        token: useAuthStore.getState().token,
        navigate,
        pathname: location.pathname,
        productId,
        onSuccess: setCart,
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to add this item right now.')
    } finally {
      setAddingId(null)
    }
  }

  const onSearchSubmit = (event) => {
    event.preventDefault()
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : '/products')
  }

  return (
    <div className="w-full pb-32 bg-white text-[#2c3e35] min-h-screen font-['Manrope']">
      <header className="sticky top-0 left-0 w-full bg-white z-50 border-b border-neutral-200 px-2 py-2 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/profile" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-sm font-black text-white shadow-sm">
              {(user?.full_name || 'FC')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight text-neutral-800">{user?.full_name || 'FreshCart Shopper'}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500">
                <MapPin className="h-3 w-3 text-emerald-600" />
                <span>{user?.email || 'Synced account'}</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <NotificationBell
              buttonClassName="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-neutral-50"
              iconClassName="h-4 w-4 text-neutral-600"
              dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
            />

            <Link to="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/50 bg-emerald-50/60">
              <ShoppingBag className="h-4 w-4 text-emerald-700" />
              {cartCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-6">
        <section className="mb-6">
          <h1 className="mb-5 flex flex-col gap-0.5 text-2xl font-extrabold tracking-tight">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Welcome back,</span>
            <span className="flex items-center gap-2 text-neutral-900">
              Freshness awaits.
              <Sparkles className="h-5 w-5 fill-amber-500/10 text-amber-500" />
            </span>
          </h1>

          <form className="flex items-center gap-2" onSubmit={onSearchSubmit}>
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                className="w-full rounded-2xl border border-neutral-200/80 bg-white py-3.5 pl-11 pr-4 text-xs font-medium shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/5"
                placeholder="Search fresh harvest, meats, or pantry..."
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 text-neutral-600 shadow-sm transition-all hover:bg-neutral-50" type="submit">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </form>
        </section>

        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        {activeOrder ? (
          <section className="mb-8">
            <div className="flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-white bg-brand-orange p-5 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full border border-white bg-brand-orange px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                    Active Order
                  </span>
                  <h2 className="mt-4 text-base font-bold leading-snug text-white">
                    {orderStatusMeta(activeOrder.status).label} for
                    <br />
                    <span className="text-amber-300">{formatOrderNumber(activeOrder.id)}</span>
                  </h2>
                </div>
                <div className="text-right text-[10px] text-white/90">
                  <p>{new Date(activeOrder.created_at).toLocaleDateString()}</p>
                  <p className="mt-1 flex items-center justify-end gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {activeOrder.status.replaceAll('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-white">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{activeOrder.items.length} items in this order</span>
                </div>
                <Link className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-sm transition-all hover:bg-emerald-50" to={`/track-rider/${activeOrder.id}`}>
                  Track <ArrowRight className="h-3.5 w-3.5 text-black" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-neutral-800">Categories</h3>
            <Link className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline" to="/categories">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                className="flex w-20 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-neutral-200/60 bg-white p-3 transition-all hover:border-emerald-200/50 hover:shadow-sm"
                to={`/category/${category.id}`}
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-amber-50 p-1.5">
                  <img alt={category.name} className="h-full w-full rounded-lg object-cover" src={category.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'} />
                </div>
                <span className="text-center text-[10px] font-bold tracking-tight text-neutral-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-neutral-800">Recommended for You</h3>
          </div>

          <div className="space-y-3">
            {recommendedProducts.map((product) => {
              const badge = productBadge(product)
              return (
                <div key={product.id} className="group relative flex items-center gap-4 rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-sm">
                  <Link className="flex w-20 flex-shrink-0 items-center gap-4" to={`/products/${product.id}`}>
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-50">
                      <img alt={product.name} className="h-full w-full object-cover" src={getProductImage(product)} />
                      <span className={`absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[8px] font-bold ${badge.className}`}>{badge.text}</span>
                    </div>
                  </Link>
                  <div className="flex-grow">
                    <Link className="text-xs font-bold leading-tight text-neutral-900" to={`/products/${product.id}`}>
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-[10px] text-neutral-400">{product.description}</p>
                    <p className="mt-2.5 text-xs font-extrabold text-emerald-600">
                      {formatCurrency(product.price)} <span className="text-[9px] font-medium text-neutral-400">/ {product.unit}</span>
                    </p>
                  </div>
                  <button
                    className="rounded-xl bg-orange-500 p-2.5 font-bold text-white shadow-sm transition-all active:scale-95 hover:bg-orange-600"
                    onClick={() => addToCart(product.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  {addingId === product.id ? <span className="absolute bottom-2 right-4 text-[10px] font-medium text-neutral-400">Adding...</span> : null}
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
