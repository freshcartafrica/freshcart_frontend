import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  LuArrowRight,
  LuBadgeCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuHeart,
  LuLayoutGrid,
  LuList,
  LuPercent,
  LuSearch,
  LuShoppingBag,
  LuShoppingCart,
  LuSlidersHorizontal,
  LuStar,
  LuTimer,
  LuX,
  LuZap,
} from 'react-icons/lu'
import { endpoints } from '../../lib/api'
import { formatCurrency, getProductImage } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'

const DealsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = useAuthStore((state) => state.token)
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingId, setAddingId] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const featuredRef = useRef(null)
  const flashDealsRef = useRef(null)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'discount'
  const dealType = searchParams.get('deal_type') || ''

  // Flash deals with countdown
  const [flashDealTime, setFlashDealTime] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashDealTime(prev => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          endpoints.products({
            ...(search ? { search } : {}),
            ...(category ? { category } : {}),
            on_sale: true,
          }),
          endpoints.categories(),
        ])

        if (cancelled) return
        setProducts(productsResponse.data)
        setCategories(categoriesResponse.data)
      } catch (loadError) {
        if (!cancelled) setError('Unable to load deals at this time.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category, search])

  // Get products with discounts
  const dealProducts = useMemo(() => {
    return products.filter(p => p.on_sale || p.discount_percentage > 0)
  }, [products])

  // Flash deals (limited time)
  const flashDeals = useMemo(() => {
    return dealProducts.filter(p => p.flash_deal).slice(0, 6)
  }, [dealProducts])

  // Best value deals
  const bestValueDeals = useMemo(() => {
    return dealProducts
      .sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
      .slice(0, 8)
  }, [dealProducts])

  // Bundle deals (for demo, group products)
  const bundleDeals = useMemo(() => {
    return dealProducts.slice(0, 4)
  }, [dealProducts])

  const categoryName = useMemo(() => {
    if (!category) return 'All Categories'
    return categories.find((item) => item.slug === category)?.name || category
  }, [categories, category])

  const updateFilters = (next) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    setSearchParams(params)
  }

  const addToCart = async (productId, count = 1) => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setAddingId(productId)
      await endpoints.addToCart({ product_id: productId, quantity: count })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to add item to cart.')
    } finally {
      setAddingId(null)
    }
  }

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 340
      const newScroll = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount
      ref.current.scrollTo({ left: newScroll, behavior: 'smooth' })
    }
  }

  const sortOptions = [
    { value: 'discount', label: 'Biggest Discount' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Deals' },
    { value: 'ending_soon', label: 'Ending Soon' },
  ]

  const dealTypes = [
    { value: '', label: 'All Deals' },
    { value: 'flash', label: 'Flash Sales' },
    { value: 'bundle', label: 'Bundle Deals' },
    { value: 'clearance', label: 'Clearance' },
    { value: 'buy_one_get_one', label: 'Buy 1 Get 1' },
  ]

  return (
    <>
      <style>
        {`
          .product-shadow {
            box-shadow: 0 32px 64px -12px rgba(44, 47, 48, 0.08);
          }
          .bento-hover:hover {
            transform: translateY(-4px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .filter-backdrop {
            backdrop-filter: blur(8px);
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .flash-deal-card {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          }
          .bundle-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .clearance-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .pulse-animation {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
        {/* Navigation */}
    
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <LuZap size={16} className="fill-white" />
                  <span className="text-xs font-bold tracking-wider uppercase">Limited Time Offers</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  Mega Deals <br />
                  <span className="text-yellow-300">Up to 70% Off</span>
                </h1>
                <p className="text-lg text-orange-100 max-w-md">
                  Stock up on fresh groceries at unbeatable prices. New deals added every day!
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl">
                    Shop All Deals
                  </button>
                  <div className="hidden sm:flex items-center gap-2 text-orange-100 text-sm">
                    <LuClock size={18} />
                    <span>New deals daily at 8 AM</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center border border-white/20 shadow-2xl">
                  <LuPercent size={120} className="text-white/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-black">70</div>
                      <div className="text-2xl font-bold">% OFF</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Deals Countdown */}
        {flashDeals.length > 0 && (
          <section className="bg-white border-b border-slate-100 py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <LuZap size={24} className="text-red-500 fill-red-500" />
                      <h2 className="text-2xl font-black text-slate-900">Flash Deals</h2>
                    </div>
                    <p className="text-slate-500 text-sm">Hurry! These deals end soon</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
                      <div className="text-lg font-black">{String(flashDealTime.hours).padStart(2, '0')}</div>
                      <div className="text-[9px] uppercase tracking-wider opacity-70">Hours</div>
                    </div>
                    <span className="text-2xl font-black text-slate-300">:</span>
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
                      <div className="text-lg font-black">{String(flashDealTime.minutes).padStart(2, '0')}</div>
                      <div className="text-[9px] uppercase tracking-wider opacity-70">Mins</div>
                    </div>
                    <span className="text-2xl font-black text-slate-300">:</span>
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-center min-w-[50px]">
                      <div className="text-lg font-black">{String(flashDealTime.seconds).padStart(2, '0')}</div>
                      <div className="text-[9px] uppercase tracking-wider opacity-70">Secs</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollContainer(flashDealsRef, 'left')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all bg-white shadow-sm"
                  >
                    <LuChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => scrollContainer(flashDealsRef, 'right')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all bg-white shadow-sm"
                  >
                    <LuChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div 
                ref={flashDealsRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
              >
                {flashDeals.map((product) => (
                  <div 
                    key={product.id}
                    className="flex-shrink-0 w-72 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 group hover:shadow-xl transition-all border border-red-100"
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          -{product.discount_percentage || 30}%
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <LuHeart size={16} />
                        </button>
                      </div>
                    </Link>
                    <div>
                      <p className="text-[10px] text-red-600 font-black uppercase tracking-wider mb-1">
                        Flash Sale
                      </p>
                      <Link 
                        to={`/products/${product.id}`}
                        className="font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="font-black text-slate-900 text-lg">
                          {formatCurrency(product.price * 0.7)}
                        </p>
                        <p className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">75% claimed</p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <LuShoppingCart size={16} />
                        Grab Deal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Best Value Deals Slider */}
        {bestValueDeals.length > 0 && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Best Value Deals</h2>
                  <p className="text-slate-500 text-sm mt-1">Highest discounts on fresh products</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollContainer(featuredRef, 'left')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-600 hover:text-green-600 transition-all bg-white shadow-sm"
                  >
                    <LuChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => scrollContainer(featuredRef, 'right')}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-600 hover:text-green-600 transition-all bg-white shadow-sm"
                  >
                    <LuChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div 
                ref={featuredRef}
                className="flex gap-4 overflow-x-auto hide-scrollbar pb-4"
              >
                {bestValueDeals.map((product) => (
                  <div 
                    key={product.id}
                    className="flex-shrink-0 w-72 bg-white rounded-2xl p-4 group hover:shadow-xl transition-all shadow-sm"
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          -{product.discount_percentage || 25}%
                        </div>
                      </div>
                    </Link>
                    <div>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-wider mb-1">
                        {product.category?.name}
                      </p>
                      <Link 
                        to={`/products/${product.id}`}
                        className="font-bold text-slate-900 hover:text-green-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="font-black text-slate-900">
                            {formatCurrency(product.price * 0.75)}
                          </p>
                          <p className="text-xs text-slate-400 line-through">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all"
                        >
                          <LuShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bundle Deals */}
        {bundleDeals.length > 0 && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Bundle & Save</h2>
                  <p className="text-slate-500 text-sm mt-1">Save more when you buy together</p>
                </div>
                <Link to="/products" className="text-green-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-all text-sm">
                  View All Bundles <LuArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bundleDeals.map((product, index) => (
                  <div 
                    key={product.id}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 group hover:shadow-xl transition-all border border-purple-100"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-4">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        Bundle
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">
                        {product.name} Bundle
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">
                        Save {formatCurrency(product.price * 0.4)} on this bundle
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="font-black text-slate-900 text-xl">
                          {formatCurrency(product.price * 0.6)}
                        </p>
                        <p className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id, 2)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <LuShoppingCart size={16} />
                        Add Bundle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Deals Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <form
                  className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const value = new FormData(event.currentTarget).get('search')?.toString() || ''
                    updateFilters({ search: value })
                  }}
                >
                  <LuSearch className="text-slate-400 flex-shrink-0" size={18} />
                  <input
                    defaultValue={search}
                    name="search"
                    className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-slate-400"
                    placeholder="Search deals..."
                  />
                  {search && (
                    <button type="button" onClick={() => updateFilters({ search: '' })} className="p-1 hover:bg-slate-200 rounded-full">
                      <LuX size={14} className="text-slate-400" />
                    </button>
                  )}
                </form>
                <div className="flex items-center gap-2">
                  <select
                    value={dealType}
                    onChange={(e) => updateFilters({ deal_type: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
                  >
                    {dealTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="hidden sm:flex bg-slate-50 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-slate-400'}`}
                    >
                      <LuLayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-slate-400'}`}
                    >
                      <LuList size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">{dealProducts.length}</span> deals
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-5 animate-pulse">
                    <div className="aspect-square rounded-[1.5rem] bg-slate-200 mb-5" />
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-2/3" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
                      <div className="h-12 bg-slate-200 rounded-xl mt-5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dealProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LuPercent size={40} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No deals found</h3>
                <p className="text-slate-500 mb-6">Check back later for new deals!</p>
                <Link to="/products" className="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition-all inline-block">
                  Browse All Products
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dealProducts.map((product) => (
                  <article
                    key={product.id}
                    className="bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-50 group hover:shadow-2xl bento-hover transition-all relative overflow-hidden"
                  >
                    {/* Discount Ribbon */}
                    <div className="absolute top-4 -right-8 bg-red-500 text-white px-8 py-1 rotate-45 text-xs font-black z-10 shadow-lg">
                      -{product.discount_percentage || 20}%
                    </div>
                    
                    <Link to={`/products/${product.id}`} className="block">
                      <div className="relative aspect-square rounded-[1.5rem] bg-slate-50 mb-5 overflow-hidden">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <LuHeart size={18} />
                        </button>
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <p className="text-[11px] text-red-600 font-black uppercase tracking-widest mb-1">
                        {product.category?.name || 'On Sale'}
                      </p>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-bold text-slate-900 hover:text-red-600 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-1">
                        <LuStar className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="text-xs text-slate-500 font-medium">
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-lg">
                          {formatCurrency(product.price * (1 - (product.discount_percentage || 20) / 100))}
                        </p>
                        <p className="text-sm text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock_quantity === 0}
                        className={`w-full mt-3 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
                          product.stock_quantity === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        <LuShoppingCart size={16} />
                        {addingId === product.id ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Grab Deal'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dealProducts.map((product) => (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 hover:shadow-md transition-all flex gap-6"
                  >
                    <div className="w-32 h-32 flex-shrink-0 relative">
                      <Link to={`/products/${product.id}`}>
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                        -{product.discount_percentage || 20}%
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-red-600 font-black uppercase tracking-widest mb-1">
                          {product.category?.name}
                        </p>
                        <Link to={`/products/${product.id}`} className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-black text-slate-900 text-xl">
                              {formatCurrency(product.price * 0.8)}
                            </p>
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <LuStar className="text-yellow-500 fill-yellow-500" size={14} />
                            <span className="text-xs text-slate-500">{product.stock_quantity} in stock</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                        >
                          <LuShoppingCart size={16} />
                          Grab Deal
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {dealProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all bg-white font-medium">
                  1
                </button>
                <button className="w-10 h-10 rounded-xl bg-red-500 text-white font-bold">2</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all bg-white font-medium">
                  3
                </button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-500 transition-all bg-white">
                  <LuArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-slate-900 text-white py-20 rounded-[3rem] mx-6 mb-8">
          <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <LuBadgeCheck size={32} />
              </div>
              <h4 className="text-xl font-bold">Best Price Guarantee</h4>
              <p className="text-slate-400">Found a lower price? We'll match it instantly.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <LuTimer size={32} />
              </div>
              <h4 className="text-xl font-bold">Express Delivery</h4>
              <p className="text-slate-400">Deal items delivered fresh in under 45 mins.</p>
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <LuZap size={32} />
              </div>
              <h4 className="text-xl font-bold">Daily New Deals</h4>
              <p className="text-slate-400">Fresh deals added every day at 8 AM.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default DealsPage