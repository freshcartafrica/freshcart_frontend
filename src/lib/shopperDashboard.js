import { formatCurrency, getProductImage, normalizeCategoryKey } from './shopper'

export { formatCurrency, getProductImage }

export function countCartItems(cart) {
  return (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0)
}

export function formatOrderNumber(id) {
  return `#${String(id).padStart(5, '0')}`
}

export function orderStatusMeta(status) {
  return (
    {
      pending: {
        label: 'Pending',
        chip: 'text-amber-700 bg-amber-50 border-amber-200',
        accent: 'text-amber-600',
      },
      confirmed: {
        label: 'Confirmed',
        chip: 'text-blue-700 bg-blue-50 border-blue-200',
        accent: 'text-blue-600',
      },
      out_for_delivery: {
        label: 'Out for delivery',
        chip: 'text-orange-700 bg-orange-50 border-orange-200',
        accent: 'text-orange-600',
      },
      delivered: {
        label: 'Delivered',
        chip: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        accent: 'text-emerald-600',
      },
    }[status] || {
      label: 'Processing',
      chip: 'text-neutral-700 bg-neutral-50 border-neutral-200',
      accent: 'text-neutral-600',
    }
  )
}

export function categoryTheme(slug) {
  const key = normalizeCategoryKey(slug)
  return (
    {
      chicken: 'bg-amber-50 text-amber-700',
      fish: 'bg-sky-50 text-sky-700',
      turkey: 'bg-orange-50 text-orange-700',
      'goat-meat': 'bg-emerald-50 text-emerald-700',
      'cow-meat': 'bg-rose-50 text-rose-700',
    }[key] || 'bg-neutral-50 text-neutral-700'
  )
}

export function productBadge(product) {
  if (product?.featured) {
    return {
      text: 'Featured',
      className: 'bg-orange-500 text-white',
    }
  }

  if ((product?.stock_quantity || 0) <= 3) {
    return {
      text: 'Low Stock',
      className: 'bg-red-500 text-white',
    }
  }

  return {
    text: product?.category?.name || 'Fresh',
    className: 'bg-neutral-900 text-white',
  }
}

export function activeOrderFromList(orders) {
  return (orders || []).find((order) => order.status !== 'delivered') || null
}

export function estimateDeliveryFee(subtotal) {
  return subtotal < 25 ? 2.5 : 1.0
}

export function estimateDiscount(subtotal, couponCode) {
  return couponCode?.trim().toUpperCase() === 'SAVE10' ? Number((subtotal * 0.1).toFixed(2)) : 0
}

export function buildProductSnapshot(product) {
  return [
    ['Category', product?.category?.name || 'General'],
    ['Unit', product?.unit || 'item'],
    ['Stock', String(product?.stock_quantity || 0)],
    ['Listing', product?.featured ? 'Featured' : 'Standard'],
  ]
}

export function buildInitials(name) {
  return (name || 'Fresh Cart')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
