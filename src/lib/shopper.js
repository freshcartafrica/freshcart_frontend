export const fallbackImages = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
]

export const categoryArtwork = {
  fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80',
  vegetables: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1200&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
  staples: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  protein: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80',
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}

export function getProductImage(product, index = 0) {
  if (product?.image_url) return product.image_url
  return categoryArtwork[product?.category?.slug] || fallbackImages[index % fallbackImages.length]
}

export function buildProductGallery(product) {
  const primary = getProductImage(product)
  return [
    primary,
    product?.category?.image_url || primary,
    fallbackImages[(Number(product?.id) || 0) % fallbackImages.length],
  ]
}

export function statusClass(status) {
  return (
    {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      out_for_delivery: 'bg-violet-100 text-violet-700',
      delivered: 'bg-emerald-100 text-emerald-700',
    }[status] || 'bg-slate-100 text-slate-700'
  )
}

export function buildOrderTimeline(order) {
  const createdAt = order?.created_at ? new Date(order.created_at) : new Date()
  const base = createdAt.getTime()
  const steps = [
    { key: 'pending', label: 'Order confirmed', offset: 0 },
    { key: 'confirmed', label: 'Vendor packed items', offset: 15 },
    { key: 'out_for_delivery', label: 'Rider picked up order', offset: 35 },
    { key: 'delivered', label: 'Delivered successfully', offset: 60 },
  ]
  const currentIndex = Math.max(
    steps.findIndex((step) => step.key === order?.status),
    0,
  )

  return steps.slice(0, currentIndex + 1).map((step) => ({
    label: step.label,
    time: new Date(base + step.offset * 60_000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))
}

export function authLandingPath(user) {
  if (user?.role === 'vendor') return '/vendor/onboarding'
  if (user?.role === 'admin') return '/admin'
  return '/onboarding'
}

export function dashboardPath(user) {
  if (user?.role === 'vendor') return '/vendor'
  if (user?.role === 'admin') return '/admin'
  return '/dashboard'
}

export function hasCompletedOnboarding(user, onboardingRecords = {}) {
  if (!user || user.role === 'admin') return true
  return Boolean(onboardingRecords?.[user.id]?.completed)
}

export function postAuthPath(user, onboardingRecords = {}) {
  return hasCompletedOnboarding(user, onboardingRecords) ? dashboardPath(user) : authLandingPath(user)
}
