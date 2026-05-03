import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
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
  products: (params) => api.get('/products', { params }),
  product: (productId) => api.get(`/products/${productId}`),
  cart: () => api.get('/cart'),
  addToCart: (payload) => api.post('/cart/add', payload),
  removeFromCart: (payload) => api.post('/cart/remove', payload),
  orders: () => api.get('/orders'),
  order: (orderId) => api.get(`/orders/${orderId}`),
  createOrder: (payload) => api.post('/orders/create', payload),
  vendorProducts: () => api.get('/vendor/products'),
  vendorOrders: () => api.get('/vendor/orders'),
  adminAnalytics: () => api.get('/admin/analytics'),
}
