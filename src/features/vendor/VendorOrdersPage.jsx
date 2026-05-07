import { useEffect, useState, useMemo } from 'react';
import { endpoints } from '../../lib/api';
import { formatCurrency } from '../../lib/shopperDashboard';
import { NotificationBell } from '../../components/NotificationBell';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  ArrowLeft, 
  ShoppingBag,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VendorOrdersPage() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const profileResponse = await endpoints.vendorProfile();
        if (cancelled) return;

        setProfile(profileResponse.data);

        if (!profileResponse.data.is_verified) {
          setOrders([]);
          return;
        }

        const response = await endpoints.vendorOrders();
        if (!cancelled) setOrders(response.data);
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load orders.');
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((order) => String(order.status).toLowerCase() === filter);
  }, [orders, filter]);

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status).toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={12} />;
      case 'pending':
        return <Clock size={12} />;
      case 'confirmed':
      case 'out_for_delivery':
        return <Truck size={12} />;
      default:
        return <Package size={12} />;
    }
  };

  const getFilterCount = (type) => {
    if (type === 'all') return orders.length;
    return orders.filter((order) => String(order.status).toLowerCase() === type).length;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-['Inter',system-ui,-apple-system,sans-serif]">
      {/* Mobile Status Bar */}
    

      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <ShoppingBag size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">My Orders</span>
          </div>
          <NotificationBell
            buttonClassName="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
            iconClassName="h-5 w-5 text-gray-700"
            dotClassName="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-4 pb-24">
        {/* Header Section */}
        <div className="mb-6">
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Your Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage all customer purchases
          </p>
        </div>

        {/* Filter Chips - Mobile Optimized */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-2 min-w-max">
            {['all', 'pending', 'confirmed', 'out_for_delivery', 'delivered'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  filter === type 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 active:bg-gray-50'
                }`}
              >
                {type === 'all'
                  ? 'All'
                  : type.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === type ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {getFilterCount(type)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-5 bg-red-50 rounded-xl p-4 flex items-start gap-3 border border-red-100">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Unable to load orders</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {profile && !profile.is_verified && !error && (
          <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Orders unlock after vendor approval</p>
            <p className="mt-1 text-xs text-amber-700">
              Your vendor account is still pending admin verification, so there are no order records available yet.
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Order #{order.id.toString().padStart(5, '0')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{String(order.status).replaceAll('_', ' ')}</span>
                      </div>
                    </div>

                  {/* Order Content */}
                  <div className="p-4">
                    {/* Address */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {order.delivery_address}
                      </p>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      {order.items.length > 0 && (
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-[8px] font-bold text-gray-600">
                                {item.product_name?.charAt(0) || 'P'}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-[8px] font-bold text-gray-500">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer with Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {filter !== 'all' 
                ? `No ${filter} orders at the moment. Try a different filter.`
                : "You haven't received any orders yet. Share your products to get started."
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full active:bg-gray-800"
              >
                View all orders
              </button>
            )}
          </div>
        )}

        {/* Quick Stats Summary */}
        {orders.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-lg font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-lg font-bold text-amber-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Confirmed</p>
              <p className="text-lg font-bold text-blue-600">
                {orders.filter((order) => order.status === 'confirmed').length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (Optional) */}
      <button 
        onClick={() => navigate('/vendor/upload-product')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gray-900 shadow-lg flex items-center justify-center active:bg-gray-800 transition-colors z-50"
      >
        <Package size={22} className="text-white" />
      </button>
    </div>
  );
}
