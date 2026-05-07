import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { addProductToCart } from '../../lib/cartActions'
import {
  buildProductSnapshot,
  countCartItems,
  formatCurrency,
  getProductImage,
  productBadge,
} from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { productId } = useParams()
  const token = useAuthStore((state) => state.token)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const productResponse = await endpoints.product(productId)
        if (cancelled) return
        setProduct(productResponse.data)

        const requests = [endpoints.products({ category: productResponse.data.category.slug })]
        if (token) requests.push(endpoints.cart())
        const [relatedResponse, cartResponse] = await Promise.all(requests)

        if (cancelled) return
        setRelatedProducts(relatedResponse.data.filter((item) => item.id !== productResponse.data.id).slice(0, 3))
        setCart(cartResponse?.data || null)
      } catch {
        if (!cancelled) setError('Unable to load this product right now.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId, token])

  const gallery = useMemo(() => {
    if (!product) return []
    const primary = getProductImage(product)
    return [primary, product.category?.image_url || primary, primary]
  }, [product])

  const badge = productBadge(product)
  const cartCount = countCartItems(cart)

  const addToCart = async () => {
    if (!product) return

    try {
      await addProductToCart({
        token,
        navigate,
        pathname: location.pathname,
        productId: product.id,
        quantity,
        onSuccess: setCart,
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to add this item.')
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white px-4 py-6 font-['Manrope']">
        <button className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-neutral-800" />
        </button>
        <p className="text-sm text-neutral-500">{error || 'Loading product...'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 transition-all active:bg-neutral-100" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-neutral-800" />
          </button>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 transition-all active:bg-neutral-100" onClick={() => setIsFavorite((current) => !current)}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-700'}`} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 transition-all active:bg-neutral-100">
              <Share2 className="h-5 w-5 text-neutral-700" />
            </button>
            <Link className="relative flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 transition-all active:bg-orange-100" to="/cart">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              {cartCount ? <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-[9px] font-bold text-white">{cartCount}</span> : null}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl">
        <div className="relative">
          <div className="relative h-80 bg-neutral-50">
            <img alt={product.name} className="h-full w-full object-cover" src={gallery[selectedImage]} />
            <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.text}</span>
          </div>
          <div className="relative z-10 -mt-8 flex gap-2 px-4">
            {gallery.map((img, index) => (
              <button
                key={`${img}-${index}`}
                className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === index ? 'border-orange-500 shadow-md' : 'border-white'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img alt="" className="h-full w-full object-cover" src={img} />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4">
          {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold leading-tight text-neutral-900">{product.name}</h1>
            <p className="mt-1 text-sm text-neutral-400">{product.category.name}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-orange-600">{formatCurrency(product.price)}</span>
              <span className="text-sm text-neutral-400">/{product.unit}</span>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center rounded-2xl border border-neutral-200 bg-neutral-50">
              <button className="flex h-12 w-12 items-center justify-center rounded-l-2xl active:bg-neutral-100" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                <Minus className="h-5 w-5 text-neutral-700" />
              </button>
              <span className="w-12 text-center font-bold text-neutral-900">{quantity}</span>
              <button className="flex h-12 w-12 items-center justify-center rounded-r-2xl active:bg-neutral-100" onClick={() => setQuantity((current) => current + 1)}>
                <Plus className="h-5 w-5 text-neutral-700" />
              </button>
            </div>
            <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:bg-orange-600" onClick={addToCart}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart • {formatCurrency(product.price * quantity)}
            </button>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-lg font-extrabold text-neutral-900">Description</h2>
            <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-lg font-extrabold text-neutral-900">Product Snapshot</h2>
            <div className="grid grid-cols-2 gap-3">
              {buildProductSnapshot(product).map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-neutral-50 p-3 text-center">
                  <p className="text-lg font-extrabold text-orange-600">{value}</p>
                  <p className="text-[10px] capitalize text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-neutral-900">You Might Also Like</h2>
              <Link className="flex items-center gap-1 text-sm font-bold text-orange-600" to={`/products?category=${product.category.slug}`}>
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} className="w-36 flex-shrink-0 rounded-2xl bg-neutral-50 p-3" to={`/products/${item.id}`}>
                  <div className="mb-2 h-24 w-full overflow-hidden rounded-xl">
                    <img alt={item.name} className="h-full w-full object-cover" src={getProductImage(item)} />
                  </div>
                  <p className="text-xs font-bold text-neutral-900">{item.name}</p>
                  <p className="mt-1 text-sm font-extrabold text-orange-600">
                    {formatCurrency(item.price)}/{item.unit}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50">
            <Heart className="h-5 w-5 text-neutral-700" />
          </button>
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white shadow-lg" onClick={addToCart}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
