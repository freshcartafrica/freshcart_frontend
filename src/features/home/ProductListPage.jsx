import { Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { addProductToCart } from '../../lib/cartActions'
import { filterMarketplaceCategories, filterMarketplaceProducts } from '../../lib/shopper'
import { countCartItems, formatCurrency, getProductImage, productBadge } from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function ProductListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = useAuthStore((state) => state.token)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') || '')
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const requests = [
          endpoints.products({
            ...(activeCategory ? { category: activeCategory } : {}),
            ...(searchParams.get('search') ? { search: searchParams.get('search') } : {}),
          }),
          endpoints.categories(),
        ]

        if (token) requests.push(endpoints.cart())

        const [productsResponse, categoriesResponse, cartResponse] = await Promise.all(requests)

        if (cancelled) return
        setProducts(filterMarketplaceProducts(productsResponse.data))
        setCategories(filterMarketplaceCategories(categoriesResponse.data))
        setCart(cartResponse?.data || null)
      } catch {
        if (!cancelled) setError('Unable to load the product catalog right now.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [activeCategory, searchParams, token])

  const cartCount = countCartItems(cart)
  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 4), [products])

  const updateSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchDraft) params.set('search', searchDraft)
    else params.delete('search')
    setSearchParams(params)
  }

  const addToCart = async (productId) => {
    try {
      await addProductToCart({
        token,
        navigate,
        pathname: location.pathname + location.search,
        productId,
        onSuccess: setCart,
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to add this item.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-[20px] font-extrabold tracking-tight text-neutral-900">Fresh Catalog</h1>
            <p className="text-[12px] text-neutral-400">{products.length} live products</p>
          </div>
          <Link className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-50" to="/cart">
            <ShoppingCart className="h-5 w-5 text-orange-600" />
            {cartCount ? <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-[9px] font-bold text-white">{cartCount}</span> : null}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        <form className="mb-6 flex items-center gap-2" onSubmit={updateSearch}>
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-[13px] font-medium outline-none placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
              placeholder="Search products..."
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
            />
          </div>
          <button className="rounded-xl border border-neutral-200 bg-white p-3 text-neutral-600">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </form>

        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
          <button
            type="button"
            className={`flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold ${!activeCategory ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600'}`}
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.delete('category')
              setSearchParams(params)
            }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold ${activeCategory === category.slug ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600'}`}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set('category', category.slug)
                setSearchParams(params)
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {featured.length ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-tight text-neutral-800">Featured Picks</h2>
              <button className="text-[10px] font-bold text-emerald-600" onClick={() => navigate('/categories')}>
                Browse categories
              </button>
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
              {featured.map((product) => (
                <Link key={product.id} className="w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-3 shadow-sm" to={`/products/${product.id}`}>
                  <div className="relative h-40 overflow-hidden rounded-2xl bg-neutral-50">
                    <img alt={product.name} className="h-full w-full object-cover" src={getProductImage(product)} />
                    <span className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[9px] font-bold ${productBadge(product).className}`}>{productBadge(product).text}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-neutral-900">{product.name}</h3>
                  <p className="mt-1 text-[11px] text-neutral-400">{product.description}</p>
                  <p className="mt-2 text-sm font-extrabold text-orange-600">{formatCurrency(product.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm">
              <Link to={`/products/${product.id}`}>
                <div className="relative h-40 overflow-hidden bg-neutral-50">
                  <img alt={product.name} className="h-full w-full object-cover" src={getProductImage(product)} />
                  <span className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[9px] font-bold ${productBadge(product).className}`}>{productBadge(product).text}</span>
                </div>
              </Link>
              <div className="p-3">
                <h3 className="text-[13px] font-bold text-neutral-900">{product.name}</h3>
                <p className="mt-0.5 text-[11px] text-neutral-400">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-orange-600">{formatCurrency(product.price)}</span>
                    <span className="ml-0.5 text-[10px] text-neutral-400">/{product.unit}</span>
                  </div>
                  <button className="rounded-lg bg-neutral-900 p-2 text-white" onClick={() => addToCart(product.id)}>
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
