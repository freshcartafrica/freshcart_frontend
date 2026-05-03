import { ArrowLeft, Check, CreditCard } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import {
  estimateDeliveryFee,
  estimateDiscount,
  formatCurrency,
} from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [step, setStep] = useState('checkout')
  const [cart, setCart] = useState(null)
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    delivery_address: '',
    delivery_instructions: '',
    coupon_code: '',
    payment_method: 'pay_on_delivery',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await endpoints.cart()
        if (!cancelled) setCart(response.data)
      } catch {
        if (!cancelled) setError('Unable to load checkout summary.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const subtotal = cart?.subtotal || 0
  const deliveryFee = useMemo(() => (cart?.items?.length ? estimateDeliveryFee(subtotal) : 0), [cart, subtotal])
  const discount = useMemo(() => estimateDiscount(subtotal, form.coupon_code), [form.coupon_code, subtotal])
  const total = useMemo(() => subtotal + deliveryFee - discount, [deliveryFee, discount, subtotal])

  const placeOrder = async () => {
    try {
      setSubmitting(true)
      setError('')
      const response = await endpoints.createOrder({
        delivery_address: form.delivery_address,
        payment_method: form.payment_method,
        coupon_code: form.coupon_code || undefined,
      })
      navigate(`/track-rider/${response.data.id}`)
    } catch (submitError) {
      setError(submitError?.response?.data?.detail || 'Unable to place this order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#fdfaf6] pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] font-extrabold text-neutral-900">{step === 'checkout' ? 'Checkout' : 'Payment'}</h1>
              <p className="text-[12px] text-neutral-400">{cart?.items?.length || 0} items</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-4">
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  s <= (step === 'checkout' ? 2 : 3) ? 'bg-orange-500 text-white' : 'bg-neutral-200 text-neutral-400'
                }`}
              >
                {s < (step === 'checkout' ? 2 : 3) ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 ? <div className="h-0.5 w-8 bg-neutral-200" /> : null}
            </div>
          ))}
        </div>

        {error ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{error}</div> : null}

        {step === 'checkout' ? (
          <>
            <div className="mb-24 space-y-4">
              <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">Contact Information</h3>
                <input
                  className="mb-3 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium outline-none focus:border-orange-500"
                  placeholder="Full Name"
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium outline-none focus:border-orange-500"
                  placeholder="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>

              <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">Delivery Address</h3>
                <textarea
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium outline-none focus:border-orange-500"
                  placeholder="Enter your full address"
                  rows={3}
                  value={form.delivery_address}
                  onChange={(event) => setForm((current) => ({ ...current, delivery_address: event.target.value }))}
                />
              </div>

              <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">Delivery Instructions</h3>
                <textarea
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium outline-none focus:border-orange-500"
                  placeholder="E.g., Leave at the door, ring bell"
                  rows={2}
                  value={form.delivery_instructions}
                  onChange={(event) => setForm((current) => ({ ...current, delivery_instructions: event.target.value }))}
                />
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white px-4 py-3">
              <button className="h-12 w-full rounded-2xl bg-orange-500 font-bold text-white shadow-lg" onClick={() => setStep('payment')}>
                Continue to Payment
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-24 space-y-4">
              {[
                ['pay_on_delivery', 'Pay on Delivery', 'Pay when your order arrives'],
                ['bank_transfer', 'Bank Transfer', 'Transfer before dispatch'],
                ['card', 'Card Payment', 'Visa and Mastercard support'],
              ].map(([value, title, description]) => (
                <button
                  key={value}
                  className={`w-full rounded-2xl border p-4 text-left ${form.payment_method === value ? 'border-orange-500 bg-white' : 'border-neutral-200/60 bg-white'}`}
                  onClick={() => setForm((current) => ({ ...current, payment_method: value }))}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`h-5 w-5 ${form.payment_method === value ? 'text-orange-500' : 'text-neutral-400'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-neutral-900">{title}</p>
                      <p className="text-xs text-neutral-400">{description}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${form.payment_method === value ? 'border-orange-500' : 'border-neutral-300'}`}>
                      {form.payment_method === value ? <div className="m-[3px] h-2.5 w-2.5 rounded-full bg-orange-500" /> : null}
                    </div>
                  </div>
                </button>
              ))}

              <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">Coupon Code</h3>
                <input
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-medium outline-none focus:border-orange-500"
                  placeholder="Use SAVE10 for live discount rules"
                  value={form.coupon_code}
                  onChange={(event) => setForm((current) => ({ ...current, coupon_code: event.target.value }))}
                />
              </div>

              <div className="rounded-2xl border border-neutral-200/60 bg-white p-4">
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
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Coupon Discount</span>
                    <span className="font-bold text-emerald-600">- {formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-100 pt-2">
                    <span className="font-bold text-neutral-900">Total</span>
                    <span className="text-base font-extrabold text-orange-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white px-4 py-3">
              <button className="h-12 w-full rounded-2xl bg-orange-500 font-bold text-white shadow-lg" onClick={placeOrder}>
                {submitting ? 'Placing Order...' : `Pay ${formatCurrency(total)} • Place Order`}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
