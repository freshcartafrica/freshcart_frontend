import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import { DashboardBottomNav } from '../components/DashboardBottomNav'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { OfflineBanner } from '../components/ui/OfflineBanner'
import AdminDashboardPage from '../features/admin/AdminDashboardPage'
import AdminLoginPage from '../features/admin/AdminLoginPage'
import AdminOrdersPage from '../features/admin/AdminOrdersPage'
import AdminRidersPage from '../features/admin/AdminRidersPage'
import AdminSignupPage from '../features/admin/AdminSignupPage'
import AdminTrackingPage from '../features/admin/AdminTrackingPage'
import AdminUsersPage from '../features/admin/AdminUsersPage'
import AdminVendorsPage from '../features/admin/AdminVendorsPage'
import AdminVerificationPage from '../features/admin/AdminVerificationPage'
import ProfilePage from '../features/profile/ProfilePage'
import VendorPage from '../features/profile/VendorPage'
import AuthPage from '../features/auth/AuthPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import LoginPage from '../features/auth/LoginPage'
import SignupPage from '../features/auth/SignupPage'
import CartPage from '../features/cart/CartPage'
import AboutPage from '../features/home/AboutPage'
import CategoryPage from '../features/home/CategoryPage'
import DealsPage from '../features/home/DealsPage'
import HomePage from '../features/home/HomePage'
import OnboardingPage from '../features/home/OnboardingPage'
import ProductDetailsPage from '../features/home/ProductDetailsPage'
import ProductListPage from '../features/home/ProductListPage'
import UserDashboardPage from '../features/home/UserDashboardPage'
import OrdersPage from '../features/orders/OrdersPage'
import OrderTrackingPage from '../features/orders/OrderTrackingPage'
import CheckoutPage from '../features/cart/CheckoutPage'
import InventoryPage from '../features/vendor/InventoryPage'
import UploadProductPage from '../features/vendor/UploadProductPage'
import VendorOnboardingPage from '../features/vendor/VendorOnboardingPage'
import VendorOrdersPage from '../features/vendor/VendorOrdersPage'
import VendorProfilePage from '../features/vendor/VendorProfilePage'
import { authLandingPath, dashboardPath, hasCompletedOnboarding, postAuthPath } from '../lib/shopper'
import { useAuthStore } from '../store/authStore'

function RequireAuth({ roles, allowIncompleteOnboarding = false, children }) {
  const { token, user, onboardingRecords } = useAuthStore()
  const location = useLocation()

  if (!token) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />
  }

  if (roles?.length && user?.role && !roles.includes(user.role)) {
    return <Navigate replace to={dashboardPath(user)} />
  }

  const onboardingComplete = hasCompletedOnboarding(user, onboardingRecords)
  if (!allowIncompleteOnboarding && !onboardingComplete) {
    return <Navigate replace to={authLandingPath(user)} />
  }

  if (allowIncompleteOnboarding && onboardingComplete) {
    return <Navigate replace to={dashboardPath(user)} />
  }

  return children
}

function RedirectAuthenticated({ children }) {
  const { token, user, onboardingRecords } = useAuthStore()

  if (token && user) {
    return <Navigate replace to={postAuthPath(user, onboardingRecords)} />
  }

  return children
}

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <OfflineBanner />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

function ShopperLayout() {
  return (
    <div className="w-full min-h-screen bg-white">
      <OfflineBanner />

      <div className="w-full min-h-screen px-4 pb-28 pt-6">
        <Outlet />
      </div>

      <DashboardBottomNav />
    </div>
  )
}

function PortalLayout() {
  return (
    <div className="min-h-screen bg-white">
      <OfflineBanner />
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  )
}

function AuthLayout() {
  return (
    <div className="min-h-screen bg-white">
      <OfflineBanner />
      <Outlet />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:productId', element: <ProductDetailsPage /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
      { path: 'deals', element: <DealsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <RedirectAuthenticated>
            <LoginPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: 'signup',
        element: (
          <RedirectAuthenticated>
            <SignupPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: 'forgot',
        element: (
          <RedirectAuthenticated>
            <ForgotPasswordPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: 'admin/login',
        element: (
          <RedirectAuthenticated>
            <AdminLoginPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: 'admin/signup',
        element: (
          <RedirectAuthenticated>
            <AdminSignupPage />
          </RedirectAuthenticated>
        ),
      },
      {
        path: 'onboarding',
        element: (
          <RequireAuth roles={['user']} allowIncompleteOnboarding>
            <OnboardingPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <ShopperLayout />,
    children: [
      { path: 'dashboard', element: <RequireAuth roles={['user']}><UserDashboardPage /></RequireAuth> },
      { path: 'cart', element: <RequireAuth><CartPage /></RequireAuth> },
      { path: 'checkout', element: <RequireAuth roles={['user']}><CheckoutPage /></RequireAuth> },
      { path: 'orders', element: <RequireAuth roles={['user']}><OrdersPage /></RequireAuth> },
      { path: 'history', element: <RequireAuth roles={['user']}><OrdersPage /></RequireAuth> },
      { path: 'orders/:orderId', element: <RequireAuth roles={['user']}><OrderTrackingPage /></RequireAuth> },
      { path: 'track-rider/:orderId', element: <RequireAuth roles={['user']}><OrderTrackingPage /></RequireAuth> },
      { path: 'profile', element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: 'categories', element: <RequireAuth><CategoryPage /></RequireAuth> },
    ],
  },
  {
    path: '/',
    element: <PortalLayout />,
    children: [
      { path: 'vendor', element: <RequireAuth roles={['vendor']}><VendorPage /></RequireAuth> },
      { path: 'vendor/onboarding', element: <RequireAuth roles={['vendor']} allowIncompleteOnboarding><VendorOnboardingPage /></RequireAuth> },
      { path: 'vendor/profile', element: <RequireAuth roles={['vendor']}><VendorProfilePage /></RequireAuth> },
      { path: 'vendor/upload-product', element: <RequireAuth roles={['vendor']}><UploadProductPage /></RequireAuth> },
      { path: 'vendor/inventory', element: <RequireAuth roles={['vendor']}><InventoryPage /></RequireAuth> },
      { path: 'vendor/orders', element: <RequireAuth roles={['vendor']}><VendorOrdersPage /></RequireAuth> },
      { path: 'admin', element: <RequireAuth roles={['admin']}><AdminDashboardPage /></RequireAuth> },
      { path: 'admin/orders', element: <RequireAuth roles={['admin']}><AdminOrdersPage /></RequireAuth> },
      { path: 'admin/vendors', element: <RequireAuth roles={['admin']}><AdminVendorsPage /></RequireAuth> },
      { path: 'admin/users', element: <RequireAuth roles={['admin']}><AdminUsersPage /></RequireAuth> },
      { path: 'admin/riders', element: <RequireAuth roles={['admin']}><AdminRidersPage /></RequireAuth> },
      { path: 'admin/verification', element: <RequireAuth roles={['admin']}><AdminVerificationPage /></RequireAuth> },
      { path: 'admin/tracking', element: <RequireAuth roles={['admin']}><AdminTrackingPage /></RequireAuth> },
    ],
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
])
