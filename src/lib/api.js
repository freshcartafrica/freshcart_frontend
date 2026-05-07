import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://freshcart-backend-bsht.onrender.com',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const endpoints = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  me: () => api.get('/users/me'),
  categories: () => api.get('/categories'),
  createCategory: (payload) => api.post('/categories', payload),
  updateCategory: (categoryId, payload) => api.put(`/categories/${categoryId}`, payload),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
  products: (params) => api.get('/products', { params }),
  product: (productId) => api.get(`/products/${productId}`),
  cart: () => api.get('/cart'),
  addToCart: (payload) => api.post('/cart/add', payload),
  removeFromCart: (payload) => api.post('/cart/remove', payload),
  orders: () => api.get('/orders'),
  order: (orderId) => api.get(`/orders/${orderId}`),
  createOrder: (payload) => api.post('/orders/create', payload),
  notifications: () => api.get('/notifications'),
  readNotification: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  readAllNotifications: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  vendorProfile: () => api.get('/vendor/profile'),
  updateVendorProfile: (payload) => api.put('/vendor/profile', payload),
  vendorProducts: () => api.get('/vendor/products'),
  createVendorProduct: (payload) => api.post('/vendor/products', payload),
  updateVendorProduct: (productId, payload) => api.put(`/vendor/products/${productId}`, payload),
  deleteVendorProduct: (productId) => api.delete(`/vendor/products/${productId}`),
  vendorOrders: () => api.get('/vendor/orders'),
  adminUsers: () => api.get('/admin/users'),
  adminOrders: () => api.get('/admin/orders'),
  adminAnalytics: () => api.get('/admin/analytics'),
  adminVendors: () => api.get('/admin/vendors'),
  approveVendor: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve`),
  adminPendingProducts: () => api.get('/admin/products/pending'),
  approveProduct: (productId) => api.put(`/admin/products/${productId}/approve`),
  rejectProduct: (productId) => api.delete(`/admin/products/${productId}`),
}
