export const fallbackImages = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
]

export const categoryArtwork = {
  chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80',
  fish: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1200&q=80',
  turkey: 'https://images.unsplash.com/photo-1603046891744-76e6300f1d38?auto=format&fit=crop&w=1200&q=80',
  'goat-meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
  'cow-meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
}

export const starterCategoryDefinitions = [
  { key: 'chicken', slug: 'chicken', name: 'Chicken' },
  { key: 'fish', slug: 'fish', name: 'Fish' },
  { key: 'turkey', slug: 'turkey', name: 'Turkey' },
  { key: 'goat-meat', slug: 'goat-meat', name: 'Goat meat' },
  { key: 'cow-meat', slug: 'cow-meat', name: 'Cow meat' },
]

export function normalizeCategoryKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function starterCategoryImage(value) {
  return categoryArtwork[normalizeCategoryKey(value)] || fallbackImages[0]
}

export function filterMarketplaceCategories(categories = []) {
  const byKey = new Map(
    (categories || []).map((category) => [
      normalizeCategoryKey(category.slug || category.name),
      category,
    ]),
  )

  return starterCategoryDefinitions
    .map((definition, index) => {
      const matched = byKey.get(definition.key)
      if (!matched) return null

      return {
        ...matched,
        name: definition.name,
        slug: definition.slug,
        image_url: matched.image_url || starterCategoryImage(definition.key),
        sort_order: index,
      }
    })
    .filter(Boolean)
}

export function filterMarketplaceProducts(products = []) {
  const allowedKeys = new Set(starterCategoryDefinitions.map((item) => item.key))

  return (products || []).filter((product) =>
    allowedKeys.has(normalizeCategoryKey(product?.category?.slug || product?.category?.name)),
  )
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
  return (
    starterCategoryImage(product?.category?.slug || product?.category?.name) ||
    fallbackImages[index % fallbackImages.length]
  )
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
  return '/dashboard'
}

export function dashboardPath(user) {
  if (user?.role === 'vendor') return '/vendor'
  if (user?.role === 'admin') return '/admin'
  return '/dashboard'
}

export function hasCompletedOnboarding(user, onboardingRecords = {}) {
  if (!user || user.role === 'admin' || user.role === 'user') return true
  return Boolean(onboardingRecords?.[user.id]?.completed)
}

export function postAuthPath(user, onboardingRecords = {}) {
  return hasCompletedOnboarding(user, onboardingRecords) ? dashboardPath(user) : authLandingPath(user)
}
