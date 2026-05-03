export const categories = [
  { id: 'fruits', name: 'Fresh Fruits', blurb: 'Straight from local orchards', emoji: '🍊' },
  { id: 'vegetables', name: 'Vegetables', blurb: 'Morning harvest bundles', emoji: '🥬' },
  { id: 'protein', name: 'Meat & Poultry', blurb: 'Cold-chain protected', emoji: '🍗' },
  { id: 'beverages', name: 'Beverages', blurb: 'Chilled and pantry ready', emoji: '🥤' },
  { id: 'essentials', name: 'Essentials', blurb: 'Rice, milk, bread, eggs', emoji: '🛒' },
]

export const products = [
  {
    id: 'banana-premium',
    category: 'Fruits',
    name: 'Premium Sweet Bananas',
    price: 2490,
    oldPrice: 2900,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Fast mover',
    description: 'Soft, sweet and ready-to-eat bunches sourced from peri-urban farms.',
    vendor: 'Lekki Fresh Hub',
  },
  {
    id: 'strawberry-crate',
    category: 'Fruits',
    name: 'Fresh Strawberry Crate',
    price: 4990,
    oldPrice: 6250,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    badge: '20% OFF',
    description: 'Picked at dawn and packed in ventilated trays for peak freshness.',
    vendor: 'Nairobi Berry Co.',
  },
  {
    id: 'farm-milk',
    category: 'Essentials',
    name: 'Farm Fresh Milk',
    price: 3150,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80',
    description: 'Locally chilled whole milk delivered in insulated packaging.',
    vendor: 'Mile 12 Dairy',
  },
  {
    id: 'artisan-sourdough',
    category: 'Bakery',
    name: 'Artisan Sourdough Loaf',
    price: 5500,
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    badge: 'Freshly baked',
    description: 'Crackling crust, soft center, naturally fermented for extra flavor.',
    vendor: 'Breadline Studio',
  },
  {
    id: 'market-tomatoes',
    category: 'Vegetables',
    name: 'Market Tomatoes Basket',
    price: 3800,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80',
    description: 'Juicy red tomatoes ideal for stew base, sauces and salads.',
    vendor: 'Agege Produce Yard',
  },
  {
    id: 'free-range-eggs',
    category: 'Essentials',
    name: 'Free Range Eggs',
    price: 4200,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1506976785307-8732e854ad89?auto=format&fit=crop&w=1200&q=80',
    description: 'One dozen high-protein eggs from certified cage-free growers.',
    vendor: 'Sunrise Poultry',
  },
  {
    id: 'grilled-chicken',
    category: 'Protein',
    name: 'Clean Cut Chicken Pack',
    price: 8900,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80',
    description: 'Portioned fresh chicken, cleaned and vacuum-sealed for same-day use.',
    vendor: 'Mainland Butchery',
  },
  {
    id: 'ginger-juice',
    category: 'Beverages',
    name: 'Cold Pressed Ginger Juice',
    price: 2650,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
    description: 'Sharp, refreshing and naturally sweetened with pineapple.',
    vendor: 'Juice District',
  },
]

export const deals = [
  { id: 'deal-1', title: 'Basket Boost', copy: 'Save 15% when your basket reaches ₦25,000.', accent: 'bg-brand-blue' },
  { id: 'deal-2', title: 'New User Drop', copy: 'Use code FRESH15 for your first checkout.', accent: 'bg-brand-orange' },
  { id: 'deal-3', title: 'Sunrise Rush', copy: 'Free delivery on breakfast essentials before 9AM.', accent: 'bg-brand-gold text-brand-ink' },
]

export const shopperStats = [
  { label: 'Orders this month', value: '12' },
  { label: 'Avg. delivery time', value: '24 mins' },
  { label: 'Saved with deals', value: '₦18,400' },
]

export const cartItems = [
  { id: 'c1', productId: 'banana-premium', name: 'Premium Sweet Bananas', quantity: 2, unitPrice: 2490 },
  { id: 'c2', productId: 'farm-milk', name: 'Farm Fresh Milk', quantity: 1, unitPrice: 3150 },
  { id: 'c3', productId: 'artisan-sourdough', name: 'Artisan Sourdough Loaf', quantity: 1, unitPrice: 5500 },
]

export const orderHistory = [
  {
    id: 'FC-24081',
    status: 'out_for_delivery',
    createdAt: '2026-04-28T08:20:00Z',
    totalAmount: 14130,
    deliveryAddress: '17 Admiralty Way, Lekki Phase 1, Lagos',
    items: [
      { productName: 'Premium Sweet Bananas', quantity: 2 },
      { productName: 'Farm Fresh Milk', quantity: 1 },
      { productName: 'Artisan Sourdough Loaf', quantity: 1 },
    ],
    timeline: [
      { label: 'Order confirmed', time: '08:21' },
      { label: 'Vendor packed items', time: '08:36' },
      { label: 'Rider picked up order', time: '08:49' },
      { label: 'Approaching drop-off', time: '09:07' },
    ],
  },
  {
    id: 'FC-24065',
    status: 'delivered',
    createdAt: '2026-04-26T12:10:00Z',
    totalAmount: 9200,
    deliveryAddress: '17 Admiralty Way, Lekki Phase 1, Lagos',
    items: [
      { productName: 'Market Tomatoes Basket', quantity: 1 },
      { productName: 'Free Range Eggs', quantity: 1 },
    ],
    timeline: [
      { label: 'Order confirmed', time: '12:11' },
      { label: 'Packed by vendor', time: '12:26' },
      { label: 'Delivered successfully', time: '12:57' },
    ],
  },
]

export const vendorProfile = {
  name: 'Lekki Fresh Hub',
  rating: 4.9,
  city: 'Lagos',
  specialty: 'Curated farm produce and premium dairy',
  since: '2021',
}

export const inventory = [
  { sku: 'FRT-102', name: 'Premium Sweet Bananas', stock: 48, threshold: 20, status: 'Healthy' },
  { sku: 'VEG-221', name: 'Market Tomatoes Basket', stock: 14, threshold: 18, status: 'Low' },
  { sku: 'ESS-034', name: 'Farm Fresh Milk', stock: 32, threshold: 12, status: 'Healthy' },
  { sku: 'BAK-042', name: 'Artisan Sourdough Loaf', stock: 9, threshold: 10, status: 'Restock now' },
]

export const vendorOrders = [
  { id: 'VO-812', customer: 'Amara Okeke', items: 4, value: 14130, status: 'Packing' },
  { id: 'VO-807', customer: 'Peter Mwangi', items: 2, value: 9200, status: 'Awaiting rider' },
  { id: 'VO-799', customer: 'Nneka Bello', items: 7, value: 22400, status: 'Delivered' },
]

export const adminMetrics = [
  { label: 'Gross merchandise value', value: '₦18.2M' },
  { label: 'Orders today', value: '482' },
  { label: 'Active vendors', value: '134' },
  { label: 'Conversion rate', value: '8.7%' },
]

export const topVendors = [
  { name: 'Lekki Fresh Hub', score: '98%', city: 'Lagos' },
  { name: 'Nairobi Berry Co.', score: '95%', city: 'Nairobi' },
  { name: 'Kano Pantry Direct', score: '93%', city: 'Kano' },
]

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}
