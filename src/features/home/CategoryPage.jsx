import {
  ArrowLeft,
  ChevronDown,
  Grid3X3,
  Heart,
  List,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { addProductToCart } from '../../lib/cartActions'
import {
  categoryTheme,
  countCartItems,
  formatCurrency,
  getProductImage,
  productBadge,
} from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function CategoryDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { categoryId } = useParams()
  const token = useAuthStore((state) => state.token)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState('')
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const requests = [
          endpoints.categories(),
          endpoints.products(),
        ]

        if (token) requests.push(endpoints.cart())

        const [categoriesResponse, productsResponse, cartResponse] = await Promise.all(requests)

        if (cancelled) return

        const categoryList = categoriesResponse.data
        const matchedCategory =
          categoryList.find((item) => String(item.id) === String(categoryId)) ||
          categoryList.find((item) => item.slug === categoryId)

        setCategories(categoryList)
        setProducts(productsResponse.data)
        setCart(cartResponse?.data || null)
        setSelectedCategory(matchedCategory?.slug || 'all')
      } catch {
        if (!cancelled) setError('Unable to load the category catalog right now.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [categoryId, token])

  const categoryOptions = useMemo(() => ['all', ...categories.map((item) => item.slug)], [categories])

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category.slug === selectedCategory
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })

    const sorted = [...filtered]
    if (sortBy === 'price_low') sorted.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_high') sorted.sort((a, b) => b.price - a.price)
    if (sortBy === 'stock') sorted.sort((a, b) => b.stock_quantity - a.stock_quantity)
    if (sortBy === 'popular') sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.stock_quantity - a.stock_quantity)
    return sorted
  }, [products, search, selectedCategory, sortBy])

  const activeCategory = categories.find((item) => item.slug === selectedCategory)
  const cartCount = countCartItems(cart)

  const addToCart = async (productId) => {
    try {
      setAddingId(productId)
      await addProductToCart({
        token,
        navigate,
        pathname: location.pathname,
        productId,
        onSuccess: setCart,
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to add this item.')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#fdfaf6] pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-1 py-1">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 transition-all active:bg-neutral-100" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[15px] font-extrabold tracking-tight text-neutral-900">
                {activeCategory?.name || 'Fresh Categories'}
              </h1>
              <p className="text-[12px] font-medium text-neutral-400">{visibleProducts.length} products</p>
            </div>
            <Link className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 transition-all active:bg-orange-100" to="/cart">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              {cartCount ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-[13px] font-medium outline-none placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5"
              placeholder="Search fresh categories..."
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button className="rounded-xl border border-neutral-200 bg-white p-3 text-neutral-600 transition-all hover:bg-neutral-50">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
          <button
            type="button"
            className={`flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${selectedCategory === 'all' ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Items
          </button>
          {categoryOptions.slice(1).map((slug) => {
            const item = categories.find((category) => category.slug === slug)
            return (
              <button
                key={slug}
                type="button"
                className={`flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${selectedCategory === slug ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600'}`}
                onClick={() => setSelectedCategory(slug)}
              >
                {item?.name || slug}
              </button>
            )
          })}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
            <span>Sort by:</span>
            <select className="appearance-none bg-transparent outline-none" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="popular">Popular</option>
              <option value="price_low">Price: Low</option>
              <option value="price_high">Price: High</option>
              <option value="stock">Stock</option>
            </select>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5">
            <button type="button" className={`rounded-md p-1.5 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`} onClick={() => setViewMode('grid')}>
              <Grid3X3 className="h-4 w-4 text-neutral-700" />
            </button>
            <button type="button" className={`rounded-md p-1.5 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`} onClick={() => setViewMode('list')}>
              <List className="h-4 w-4 text-neutral-700" />
            </button>
          </div>
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
          {visibleProducts.map((product) => {
            const badge = productBadge(product)
            const theme = categoryTheme(product.category.slug)

            if (viewMode === 'list') {
              return (
                <Link key={product.id} className="block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md" to={`/products/${product.id}`}>
                  <div className="flex gap-4 p-4">
                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-50">
                      <img alt={product.name} className="h-full w-full object-cover" src={getProductImage(product)} />
                      <span className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[9px] font-bold ${badge.className}`}>{badge.text}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${theme}`}>{product.category.name}</span>
                        <h3 className="mt-2 text-sm font-bold text-neutral-900">{product.name}</h3>
                        <p className="mt-1 text-[11px] text-neutral-400">{product.description}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-extrabold text-orange-600">{formatCurrency(product.price)}</span>
                          <span className="ml-0.5 text-[10px] text-neutral-400">/{product.unit}</span>
                        </div>
                        <button
                          className="rounded-lg bg-neutral-900 p-2 text-white transition-all active:scale-90"
                          onClick={(event) => {
                            event.preventDefault()
                            addToCart(product.id)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            }

            return (
              <div key={product.id} className="group overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm transition-all hover:shadow-md">
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-40 overflow-hidden bg-neutral-50">
                    <img alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={getProductImage(product)} />
                    <span className={`absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[9px] font-bold ${badge.className}`}>{badge.text}</span>
                    <button type="button" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all active:scale-90">
                      <Heart className="h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${theme}`}>{product.category.name}</span>
                  <h3 className="mt-2 text-[13px] font-bold leading-tight text-neutral-900">{product.name}</h3>
                  <p className="mt-0.5 text-[11px] text-neutral-400">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-orange-600">{formatCurrency(product.price)}</span>
                      <span className="ml-0.5 text-[10px] text-neutral-400">/{product.unit}</span>
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white transition-all active:scale-90" onClick={() => addToCart(product.id)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {addingId === product.id ? <p className="mt-2 text-[10px] text-neutral-400">Adding to cart...</p> : null}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
