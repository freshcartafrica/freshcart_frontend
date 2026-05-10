import {
  ArrowLeft,
  ChevronRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import { countCartItems, formatCurrency, getProductImage } from '../../lib/shopperDashboard'

export default function CartCheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [orders, setOrders] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        const [cartResponse, ordersResponse] = await Promise.all([endpoints.cart(), endpoints.orders()])
        if (cancelled) return
        setCart(cartResponse.data)
        setOrders(ordersResponse.data)
      } catch {
        if (!cancelled) setError('Unable to load your cart right now.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const deliveryFee = items.length ? 2.5 : 0
  const total = subtotal + deliveryFee
  const latestAddress = orders[0]?.delivery_address
  const itemCount = countCartItems(cart)

  const addOne = async (productId) => {
    try {
      setUpdatingId(productId)
      const response = await endpoints.addToCart({ product_id: productId, quantity: 1 })
      setCart(response.data)
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to update this item.')
    } finally {
      setUpdatingId(null)
    }
  }

  const removeOne = async (productId) => {
    try {
      setUpdatingId(productId)
      const response = await endpoints.removeFromCart({ product_id: productId, quantity: 1 })
      setCart(response.data)
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to remove this item.')
    } finally {
      setUpdatingId(null)
    }
  }

  const removeItemCompletely = async (productId, quantity) => {
    try {
      setUpdatingId(productId)
      const response = await endpoints.removeFromCart({ product_id: productId, quantity })
      setCart(response.data)
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to remove this item.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-2 py-2">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-[15px] font-extrabold text-neutral-900">My Cart</h1>
              <p className="text-[12px] text-neutral-400">{itemCount} items</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4">
        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        {!items.length ? (
          <div className="rounded-2xl border border-neutral-200/60 bg-white p-5">
            <p className="text-sm font-bold text-neutral-900">Your cart is empty.</p>
            <button className="mt-4 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-neutral-200/60 bg-white p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                      <img alt={item.product_name} className="h-full w-full object-cover" src={item.image_url || getProductImage({ image_url: item.image_url })} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900">{item.product_name}</h3>
                          <p className="mt-0.5 text-xs text-neutral-400">{formatCurrency(item.unit_price)} each</p>
                        </div>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 active:bg-red-100" onClick={() => removeItemCompletely(item.product_id, item.quantity)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50">
                          <button className="flex h-8 w-8 items-center justify-center border-r border-neutral-200" onClick={() => removeOne(item.product_id)}>
                            <Minus className="h-3.5 w-3.5 text-neutral-700" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button className="flex h-8 w-8 items-center justify-center border-l border-neutral-200" onClick={() => addOne(item.product_id)}>
                            <Plus className="h-3.5 w-3.5 text-neutral-700" />
                          </button>
                        </div>
                        <span className="text-sm font-extrabold text-orange-600">{formatCurrency(item.unit_price * item.quantity)}</span>
                      </div>
                      {updatingId === item.product_id ? <p className="mt-2 text-[10px] text-neutral-400">Updating cart...</p> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-2xl border border-neutral-200/60 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Delivery Address</h3>
                <button className="text-xs font-bold text-orange-600" onClick={() => navigate('/checkout')}>
                  Change
                </button>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-bold text-neutral-900">{latestAddress ? 'Recent address' : 'Address added at checkout'}</p>
                  <p className="text-xs text-neutral-400">{latestAddress || 'Add your live delivery address in the checkout step.'}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-neutral-200/60 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Backend delivery estimate</p>
                    <p className="text-xs text-neutral-400">Fee is calculated from your real cart subtotal</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400" />
              </div>
            </div>

            <div className="mb-6 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-medium outline-none placeholder:text-neutral-400 focus:border-orange-500"
                placeholder="Enter promo code"
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
              />
              <button className="rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold text-white active:bg-neutral-950">
                Apply
              </button>
            </div>

            <div className="mb-24 rounded-2xl border border-neutral-200/60 bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-neutral-900">Order Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Delivery Fee</span>
                  <span className="font-bold text-neutral-900">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="text-base font-extrabold text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white px-4 py-3">
              <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 font-bold text-white shadow-lg" onClick={() => navigate('/checkout')}>
                <ShoppingCart className="h-5 w-5" />
                Complete Purchase • {formatCurrency(total)}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
