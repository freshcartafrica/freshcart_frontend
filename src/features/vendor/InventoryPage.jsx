import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from '../../components/NotificationBell';
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  Filter,
} from 'lucide-react';
import { endpoints } from '../../lib/api';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await endpoints.vendorProducts();
        if (!cancelled) setProducts(response.data);
      } catch (loadError) {
        if (!cancelled) setError(loadError?.response?.data?.detail || 'Unable to load inventory.');
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const getStockStatus = (item) => {
    if (!item.is_active) return { label: 'Pending Approval', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
    if (item.stock_quantity === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
    if (item.stock_quantity <= 5) return { label: 'Low Stock', color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingDown };
    return { label: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle };
  };

  const getThreshold = (item) => {
    return Math.max(5, Math.floor(item.stock_quantity * 0.3));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'pending' && !product.is_active) ||
      (filterStatus === 'low' && product.is_active && product.stock_quantity <= 5 && product.stock_quantity > 0) ||
      (filterStatus === 'out' && product.is_active && product.stock_quantity === 0) ||
      (filterStatus === 'healthy' && product.is_active && product.stock_quantity > 5);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: products.length,
    pending: products.filter(p => !p.is_active).length,
    lowStock: products.filter(p => p.is_active && p.stock_quantity <= 5 && p.stock_quantity > 0).length,
    outOfStock: products.filter(p => p.is_active && p.stock_quantity === 0).length,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-['Inter',system-ui,-apple-system,sans-serif]">
      {/* Mobile Status Bar */}
      

      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Package size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Inventory</span>
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
            Your Inventory
          </h1>
          <p className="text-sm text-gray-500">
            Monitor stock levels before they become fulfillment problems
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Pending</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Low Stock</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Out</p>
            <p className="text-xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilterSheet(!showFilterSheet)}
            className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-colors ${
              filterStatus !== 'all' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* Filter Chips (when expanded) */}
        {showFilterSheet && (
          <div className="mb-5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'low', 'out', 'healthy'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowFilterSheet(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                    filterStatus === status
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All Items' : 
                   status === 'pending' ? 'Pending Approval' :
                   status === 'low' ? 'Low Stock' :
                   status === 'out' ? 'Out of Stock' : 'Healthy'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-5 bg-red-50 rounded-xl p-4 flex items-start gap-3 border border-red-100">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Unable to load inventory</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Products List */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              const StatusIcon = status.icon;
              const threshold = getThreshold(product);
              const stockPercentage = product.is_active 
                ? Math.min(100, (product.stock_quantity / (product.stock_quantity + threshold)) * 100)
                : 0;
              
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-0.5 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400">SKU: {product.slug?.slice(0, 12) || 'N/A'}</p>
                      </div>
                      <div className={`ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${status.bg} ${status.color}`}>
                        <StatusIcon size={10} />
                        <span>{status.label}</span>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Current Stock</p>
                            <p className="text-xl font-bold text-gray-900">{product.stock_quantity}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Threshold</p>
                            <p className="text-sm font-semibold text-gray-700">{threshold} units</p>
                          </div>
                        </div>
                        {!product.is_active && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Clock size={12} />
                            <span className="text-[10px] font-medium">Pending approval</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {product.is_active && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                product.stock_quantity <= 5 ? 'bg-amber-500' : 
                                product.stock_quantity === 0 ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, stockPercentage)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {product.stock_quantity <= 5 && product.stock_quantity > 0 
                              ? '⚠️ Restock recommended soon'
                              : product.stock_quantity === 0 
                              ? '❌ Out of stock - take action'
                              : '✓ Stock level healthy'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex gap-3">
                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full"
                          >
                            Restock
                          </button>
                        )}
                        {product.stock_quantity === 0 && product.is_active && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full"
                          >
                            Urgent Restock
                          </button>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">No products found</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {searchQuery 
                ? `No products matching "${searchQuery}"`
                : "You haven't added any products to your inventory yet."}
            </p>
            <button
              onClick={() => navigate('/vendor/upload-product')}
              className="mt-4 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full flex items-center gap-2 active:bg-gray-800"
            >
              <Plus size={16} />
              Add Your First Product
            </button>
          </div>
        )}

        {/* Add Product FAB */}
        <button
          onClick={() => navigate('/vendor/upload-product')}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gray-900 shadow-lg flex items-center justify-center active:bg-gray-800 transition-colors z-50"
        >
          <Plus size={22} className="text-white" />
        </button>

        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-end bg-black/40" onClick={() => setSelectedProduct(null)}>
            <div
              className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-gray-200" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Product details</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{selectedProduct.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{selectedProduct.category?.name || 'General'}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ['Price', `₦${Number(selectedProduct.price || 0).toLocaleString()}`],
                  ['Unit', selectedProduct.unit || 'item'],
                  ['Stock', String(selectedProduct.stock_quantity ?? 0)],
                  ['Status', getStockStatus(selectedProduct).label],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {selectedProduct.description || 'No product description has been added for this item yet.'}
              </p>
              <button
                onClick={() => navigate('/vendor/upload-product')}
                className="mt-5 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Add another product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
