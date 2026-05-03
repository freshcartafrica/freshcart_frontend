import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CreditCard,
  Edit3,
  Heart,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Star,
  X,
  Check,
  Plus,
  Smartphone,
  Building,
  Globe,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../../lib/api'
import {
  activeOrderFromList,
  buildInitials,
  countCartItems,
} from '../../lib/shopperDashboard'
import { useAuthStore } from '../../store/authStore'

// Bottom Sheet Modal Component
function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Handle */}
        <div className="sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-3 border-b border-neutral-100">
            <h2 className="text-lg font-extrabold text-neutral-900">{title}</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200 transition-all"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Address Edit Modal Content
function AddressEditContent({ currentAddress, onSave, onClose }) {
  const [address, setAddress] = useState({
    label: currentAddress?.label || 'Home',
    street: currentAddress?.street || '',
    city: currentAddress?.city || '',
    area: currentAddress?.area || '',
    instructions: currentAddress?.instructions || '',
  })

  const savedAddresses = [
    { label: 'Home', street: '123 Kimathi Street', city: 'Nairobi', area: 'Kilimani', instructions: 'Ring doorbell' },
    { label: 'Work', street: '456 Moi Avenue', city: 'Nairobi', area: 'CBD', instructions: 'Leave at reception' },
  ]

  return (
    <div className="space-y-4 pb-6">
      {/* Saved Addresses */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-neutral-900">Saved Addresses</h3>
        {savedAddresses.map((addr, index) => (
          <button
            key={index}
            onClick={() => setAddress(addr)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              address.street === addr.street 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-neutral-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                addr.label === 'Home' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <MapPin className={`w-5 h-5 ${addr.label === 'Home' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-neutral-900">{addr.label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{addr.street}, {addr.area}</p>
                <p className="text-xs text-neutral-400">{addr.city}</p>
              </div>
              {address.street === addr.street && (
                <Check className="w-5 h-5 text-orange-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Add New Address */}
      <div>
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Add New Address</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map((label) => (
              <button
                key={label}
                onClick={() => setAddress({ ...address, label })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  address.label === label
                    ? 'bg-orange-500 text-white'
                    : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-orange-500"
            placeholder="Street address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-orange-500"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-orange-500"
              placeholder="Area"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            />
          </div>
          <textarea
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-orange-500 resize-none"
            placeholder="Delivery instructions (optional)"
            rows={2}
            value={address.instructions}
            onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => { onSave(address); onClose(); }}
        className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl active:bg-orange-600 transition-all shadow-lg"
      >
        Save Address
      </button>
    </div>
  )
}

// Payment Method Edit Modal Content
function PaymentMethodContent({ onClose }) {
  const [selectedMethod, setSelectedMethod] = useState('mpesa')

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50',
      description: 'Pay with M-Pesa mobile money',
      number: '+254 712 345 678'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50',
      description: 'Visa, Mastercard supported',
      number: '**** **** **** 4532'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50',
      description: 'Direct bank transfer',
      number: 'Equity Bank - 123456789'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-50',
      description: 'Pay when you receive your order',
      number: null
    }
  ]

  return (
    <div className="space-y-3 pb-6">
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => setSelectedMethod(method.id)}
          className={`w-full p-4 rounded-2xl border-2 transition-all ${
            selectedMethod === method.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-neutral-200 hover:border-orange-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color}`}>
              {method.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-neutral-900">{method.name}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{method.description}</p>
              {method.number && (
                <p className="text-xs font-medium text-neutral-600 mt-1">{method.number}</p>
              )}
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method.id ? 'border-orange-500' : 'border-neutral-300'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-3 h-3 rounded-full bg-orange-500" />
              )}
            </div>
          </div>
        </button>
      ))}

      {/* Add New Payment Method */}
      <button className="w-full p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-orange-300 transition-all flex items-center justify-center gap-2">
        <Plus className="w-5 h-5 text-neutral-400" />
        <span className="text-sm font-bold text-neutral-500">Add New Payment Method</span>
      </button>

      <button
        onClick={onClose}
        className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl active:bg-orange-600 transition-all shadow-lg"
      >
        Confirm Payment Method
      </button>
    </div>
  )
}

// Notification Settings Content
function NotificationSettingsContent({ onClose }) {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    deliveryAlerts: true,
    newsletter: false,
    sms: true,
    pushNotifications: true,
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationItems = [
    { key: 'orderUpdates', label: 'Order Updates', description: 'Status changes and confirmations' },
    { key: 'deliveryAlerts', label: 'Delivery Alerts', description: 'Real-time delivery tracking' },
    { key: 'promotions', label: 'Promotions & Offers', description: 'Special deals and discounts' },
    { key: 'newsletter', label: 'Weekly Newsletter', description: 'Fresh picks and recipes' },
  ]

  return (
    <div className="space-y-4 pb-6">
      {/* Notification Channels */}
      <div className="bg-neutral-50 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Notification Channels</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSetting('pushNotifications')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              settings.pushNotifications
                ? 'bg-orange-500 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            Push
          </button>
          <button
            onClick={() => toggleSetting('sms')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              settings.sms
                ? 'bg-orange-500 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            SMS
          </button>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Notification Types</h3>
        <div className="space-y-2">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings[item.key] ? 'bg-orange-500' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                  settings[item.key] ? 'left-5.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl active:bg-orange-600 transition-all shadow-lg"
      >
        Save Preferences
      </button>
    </div>
  )
}

// External Link Permission Modal
function ExternalLinkModal({ isOpen, onClose, onConfirm, title, url }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scale-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-extrabold text-neutral-900 mb-2">Leave App?</h3>
          <p className="text-sm text-neutral-600 mb-2">
            You're about to open <span className="font-bold">{title}</span>
          </p>
          <p className="text-xs text-neutral-400 mb-6">
            This will open in your device's web browser
          </p>
          
          <div className="bg-neutral-50 rounded-2xl p-3 mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-400" />
              <p className="text-xs text-neutral-500 truncate">{url}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-neutral-100 text-neutral-700 font-bold text-sm active:bg-neutral-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm active:bg-orange-600 transition-all shadow-lg"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { token, user, setSession, clearSession } = useAuthStore()
  const [profile, setProfile] = useState(user)
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState(null)

  // Modal States
  const [activeModal, setActiveModal] = useState(null) // 'address' | 'payment' | 'notifications'
  const [externalLink, setExternalLink] = useState(null) // { title, url }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [profileResponse, ordersResponse, cartResponse] = await Promise.all([
          endpoints.me(),
          endpoints.orders(),
          endpoints.cart(),
        ])

        if (cancelled) return
        setProfile(profileResponse.data)
        setSession({ token, user: profileResponse.data })
        setOrders(ordersResponse.data)
        setCart(cartResponse.data)
      } catch {
        if (!cancelled) setProfile(user)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [setSession, token, user])

  const activeOrder = useMemo(() => activeOrderFromList(orders), [orders])
  const cartCount = countCartItems(cart)

  const handleAddressSave = (address) => {
    console.log('Saving address:', address)
    // API call to save address
  }

  const handleExternalLink = (title, url) => {
    setExternalLink({ title, url })
  }

  const confirmExternalLink = () => {
    if (externalLink) {
      window.open(externalLink.url, '_blank', 'noopener,noreferrer')
      setExternalLink(null)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white pb-32 font-['Manrope'] text-[#2c3e35]">
      <header className="sticky top-0 left-0 z-50 w-full border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-2 py-2">
          <div className="flex items-center justify-between">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 text-neutral-800" />
            </button>
            <h1 className="text-[15px] font-extrabold text-neutral-900">My Profile</h1>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 active:bg-neutral-100">
              <Settings className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6">
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 shadow-lg shadow-orange-500/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-lg font-black text-white ring-4 ring-white/30">
                {buildInitials(profile?.full_name)}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                <Edit3 className="h-3 w-3 text-orange-500" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold text-white">{profile?.full_name || 'FreshCart Shopper'}</h2>
              <div className="mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-white/70" />
                <span className="text-sm text-white/80">{profile?.email || 'Synced account'}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                  <span className="text-xs font-bold text-white">{activeOrder ? 'Active' : 'Ready'}</span>
                </div>
                <span className="text-white/50">•</span>
                <span className="text-xs text-white/80">{orders.length} Orders</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-neutral-200/60 bg-white p-3 text-center">
            <ShoppingBag className="mx-auto mb-1 h-5 w-5 text-orange-500" />
            <p className="text-lg font-extrabold text-neutral-900">{orders.length}</p>
            <p className="text-[10px] font-medium text-neutral-400">Orders</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/60 bg-white p-3 text-center">
            <Heart className="mx-auto mb-1 h-5 w-5 text-red-400" />
            <p className="text-lg font-extrabold text-neutral-900">{cartCount}</p>
            <p className="text-[10px] font-medium text-neutral-400">Cart Items</p>
          </div>
          <div className="rounded-2xl border border-neutral-200/60 bg-white p-3 text-center">
            <Star className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <p className="text-lg font-extrabold text-neutral-900">{activeOrder ? 1 : 0}</p>
            <p className="text-[10px] font-medium text-neutral-400">Active Orders</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Orders</h3>
            </div>
            {[
              { icon: <Package className="h-5 w-5" />, label: 'My Orders', desc: 'View order history', color: 'text-orange-500', to: '/history' },
              { icon: <ShoppingBag className="h-5 w-5" />, label: 'Track Order', desc: activeOrder ? 'Continue tracking active order' : 'No active order yet', color: 'text-green-500', to: activeOrder ? `/track-rider/${activeOrder.id}` : '/history' },
              { icon: <ShoppingBag className="h-5 w-5" />, label: 'My Cart', desc: `${cartCount} items ready for checkout`, color: 'text-blue-500', to: '/cart' },
            ].map((item) => (
              <button key={item.label} className="flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-neutral-50" onClick={() => navigate(item.to)}>
                <div className={item.color}>{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Account</h3>
            </div>
            {[
              { 
                icon: <MapPin className="h-5 w-5" />, 
                label: 'Address', 
                desc: orders[0]?.delivery_address || 'Set during checkout', 
                color: 'text-green-500',
                onClick: () => setActiveModal('address')
              },
              { 
                icon: <CreditCard className="h-5 w-5" />, 
                label: 'Payment Methods', 
                desc: 'Pay on delivery, transfer, card', 
                color: 'text-purple-500',
                onClick: () => setActiveModal('payment')
              },
              { 
                icon: <Bell className="h-5 w-5" />, 
                label: 'Notifications', 
                desc: 'Order updates and dispatch alerts', 
                color: 'text-amber-500',
                onClick: () => setActiveModal('notifications')
              },
            ].map((item) => (
              <button 
                key={item.label} 
                className="flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-neutral-50"
                onClick={item.onClick}
              >
                <div className={item.color}>{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white">
            {[
              { 
                icon: <HelpCircle className="h-5 w-5" />, 
                label: 'Help & Support', 
                color: 'text-blue-500',
                onClick: () => handleExternalLink('Help & Support', 'https://help.freshcart.com')
              },
              { 
                icon: <Mail className="h-5 w-5" />, 
                label: 'Contact Us', 
                color: 'text-orange-500',
                onClick: () => handleExternalLink('Contact Us', 'https://freshcart.com/contact')
              },
            ].map((item) => (
              <button 
                key={item.label} 
                className="flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-neutral-50"
                onClick={item.onClick}
              >
                <div className={item.color}>{item.icon}</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 transition-all hover:bg-red-100" onClick={clearSession}>
            <LogOut className="h-5 w-5 text-red-500" />
            <span className="text-sm font-bold text-red-500">Log Out</span>
          </button>
        </div>
      </main>

      {/* Bottom Sheet Modals */}
      <BottomSheet 
        isOpen={activeModal === 'address'} 
        onClose={() => setActiveModal(null)}
        title="Delivery Address"
      >
        <AddressEditContent 
          currentAddress={orders[0]?.delivery_address}
          onSave={handleAddressSave}
          onClose={() => setActiveModal(null)}
        />
      </BottomSheet>

      <BottomSheet 
        isOpen={activeModal === 'payment'} 
        onClose={() => setActiveModal(null)}
        title="Payment Methods"
      >
        <PaymentMethodContent onClose={() => setActiveModal(null)} />
      </BottomSheet>

      <BottomSheet 
        isOpen={activeModal === 'notifications'} 
        onClose={() => setActiveModal(null)}
        title="Notifications"
      >
        <NotificationSettingsContent onClose={() => setActiveModal(null)} />
      </BottomSheet>

      {/* External Link Permission Modal */}
      <ExternalLinkModal
        isOpen={!!externalLink}
        onClose={() => setExternalLink(null)}
        onConfirm={confirmExternalLink}
        title={externalLink?.title}
        url={externalLink?.url}
      />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .animate-scale-up {
          animation: scaleUp 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}