import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupplierHeader, SupplierSidebar } from '../../components/supplier';
import { useAuth } from '../../context/AuthContext';
import { useGetSupplierProducts } from '../../hooks/useProducts';
import { SupplierOrder, SupplierUser } from '../../types';

const SupplierDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch supplier products from API
  const { data: products = [], isLoading: _productsLoading, error: _productsError } = useGetSupplierProducts(state.user?.id);
  // Wait for auth restoration on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Check authentication and load supplier data once initialized
  useEffect(() => {
    if (isInitializing) return;

    // Check if user is authenticated as supplier
    if (!state.user || state.user.role !== 'SUPPLIER') {
      navigate('/login');
      return;
    }

    // Set supplier data from auth context
    const supplierData: SupplierUser = {
      id: state.user.id,
      companyName: state.user.name,
      email: state.user.email,
    };
    setSupplier(supplierData);

    // Orders will be fetched from API when available
    // For now, set empty array
    setOrders([]);
  }, [state.user, isInitializing, navigate]);

  // Calculate stats
  const stats = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === 'new').length;
    const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
    const fulfilledOrders = orders.filter((o) => o.status === 'fulfilled').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const activeProducts = products.filter((p) => p.status === 'active').length;
    const lowStockProducts = products.filter((p) => (p.stock ?? 0) < 50).length;

    return {
      totalProducts: products.length,
      activeProducts,
      lowStockProducts,
      newOrders,
      acceptedOrders,
      fulfilledOrders,
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    };
  }, [products, orders]);

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = products.filter((p) => (p.stock ?? 50) < 50).slice(0, 5);

  if (isInitializing || !supplier) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SupplierSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <SupplierHeader
          supplier={supplier}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {supplier.companyName}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Here's your business overview for today
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalProducts}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      {stats.activeProducts} active
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders}
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">
                      {stats.newOrders} new
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Avg: ${stats.avgOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.lowStockProducts}
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      Needs attention
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/supplier/products/add')}
                  className="bg-white hover:bg-gray-50 border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Product
                </button>
                <button
                  onClick={() => navigate('/supplier/products')}
                  className="bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Inventory
                </button>
                <button
                  onClick={() => navigate('/supplier/orders')}
                  className="bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Orders
                </button>
                <button
                  onClick={() => navigate('/supplier/discounts')}
                  className="bg-white hover:bg-gray-50 border-2 border-purple-600 text-purple-600 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Discounts
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={() => navigate('/supplier/orders')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{order.buyerName}</p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item(s) - ${order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'new'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
              </div>

              {/* Low Stock Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Low Stock Items</h2>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                    {stats.lowStockProducts}
                  </span>
                </div>

                {lowStockItems.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockItems.map((product) => (
                      <div key={product.id} className="border border-red-200 bg-red-50 rounded p-3">
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-red-700">
                            Stock: {product.stock} {product.unit}
                          </span>
                          <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">All items in stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardPage;
