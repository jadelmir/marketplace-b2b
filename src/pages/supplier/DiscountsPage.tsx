import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SupplierDiscount, SupplierUser, SupplierProduct } from '../../types';
import { MOCK_SUPPLIER_DISCOUNTS, MOCK_SUPPLIER_PRODUCTS } from '../../data/mockSuppliers';
import { SupplierSidebar, SupplierHeader } from '../../components/supplier';

const DiscountsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [discounts, setDiscounts] = useState<SupplierDiscount[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'scheduled' | 'expired'>(
    'all'
  );
  const [isInitializing, setIsInitializing] = useState(true);

  const [formData, setFormData] = useState({
    productId: '',
    type: 'percentage' as 'fixed' | 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    minQuantity: '',
    code: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Filter products and discounts for this supplier
    const supplierProducts = MOCK_SUPPLIER_PRODUCTS.filter(
      (p) => p.supplierId === state.user?.id
    );
    const supplierDiscounts = MOCK_SUPPLIER_DISCOUNTS.filter(
      (d) => d.supplierId === state.user?.id
    );

    setProducts(supplierProducts);
    setDiscounts(supplierDiscounts);
  }, [state.user, isInitializing, navigate]);

  // Filter discounts by status
  const filteredDiscounts = useMemo(() => {
    if (filterStatus === 'all') {
      return discounts;
    }
    return discounts.filter((d) => d.status === filterStatus);
  }, [discounts, filterStatus]);

  // Get product name by ID
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || 'Unknown Product';
  };

  // Get discount status
  const getDiscountStatus = (discount: SupplierDiscount): 'active' | 'scheduled' | 'expired' => {
    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);

    if (now < start) return 'scheduled';
    if (now > end) return 'expired';
    return 'active';
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!formData.value || parseFloat(formData.value) <= 0)
      newErrors.value = 'Discount value must be greater than 0';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      newErrors.value = 'Percentage discount cannot exceed 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add discount
  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const selectedProduct = products.find((p) => p.id === formData.productId);
    if (!selectedProduct) return;

    const discountValue = parseFloat(formData.value);
    const originalPrice = selectedProduct.price;
    let newPrice = originalPrice;

    if (formData.type === 'percentage') {
      newPrice = originalPrice * (1 - discountValue / 100);
    } else {
      newPrice = originalPrice - discountValue;
    }

    const newDiscount: SupplierDiscount = {
      id: `disc_${Date.now()}`,
      supplierId: state.user?.id || '',
      productId: formData.productId,
      type: formData.type,
      value: discountValue,
      originalPrice,
      newPrice,
      minQuantity: formData.minQuantity ? parseFloat(formData.minQuantity) : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      code: formData.code || undefined,
      description: formData.description || undefined,
      status: getDiscountStatus({ ...formData, startDate: formData.startDate, endDate: formData.endDate } as any),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDiscounts((prev) => [...prev, newDiscount]);
    setFormData({
      productId: '',
      type: 'percentage',
      value: '',
      startDate: '',
      endDate: '',
      minQuantity: '',
      code: '',
      description: '',
    });
    setShowAddModal(false);
  };

  // Handle delete discount
  const handleDeleteDiscount = (discountId: string) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
    }
  };

  const stats = useMemo(() => {
    return {
      active: discounts.filter((d) => d.status === 'active').length,
      scheduled: discounts.filter((d) => d.status === 'scheduled').length,
      expired: discounts.filter((d) => d.status === 'expired').length,
      totalRevenueSaved: discounts
        .filter((d) => d.status === 'active')
        .reduce((sum, d) => sum + (d.originalPrice - d.newPrice), 0),
    };
  }, [discounts]);

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
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Discount Management</h1>
                <p className="text-gray-600 mt-2">
                  Create and manage special offers for your products
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Discount
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Active Discounts</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Expired</p>
                <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Total Discounts</p>
                <p className="text-2xl font-bold text-purple-600">{discounts.length}</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              {[
                { id: 'all', label: 'All Discounts', count: discounts.length },
                { id: 'active', label: 'Active', count: stats.active },
                { id: 'scheduled', label: 'Scheduled', count: stats.scheduled },
                { id: 'expired', label: 'Expired', count: stats.expired },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-4 py-3 font-medium transition border-b-2 ${
                    filterStatus === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Discounts List */}
            <div className="space-y-4">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="grid grid-cols-5 gap-4 items-center mb-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getProductName(discount.productId)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {discount.code && `Code: ${discount.code}`}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Discount</p>
                        <p className="font-bold text-lg">
                          {discount.type === 'percentage' ? (
                            <span className="text-green-600">-{discount.value}%</span>
                          ) : (
                            <span className="text-green-600">-${discount.value.toFixed(2)}</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Price Change</p>
                        <p className="font-semibold">
                          <span className="line-through text-gray-400">
                            ${discount.originalPrice.toFixed(2)}
                          </span>
                          <span className="ml-2 text-green-600">
                            ${discount.newPrice.toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-sm font-medium">
                          {new Date(discount.startDate).toLocaleDateString()} -{' '}
                          {new Date(discount.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            discount.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : discount.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {discount.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {discount.description}
                      </p>
                    )}

                    {discount.minQuantity && (
                      <p className="text-sm text-gray-600 mt-2">
                        Minimum order: {discount.minQuantity} units
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium text-lg">No discounts found</p>
                  <p className="text-gray-400">Create your first discount to attract more buyers</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Discount</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleAddDiscount} className="p-6 space-y-6">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productId: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.price.toFixed(2)})
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <p className="text-red-600 text-sm mt-1">{errors.productId}</p>
                )}
              </div>

              {/* Discount Type */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as 'fixed' | 'percentage',
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, value: e.target.value }))
                      }
                      placeholder="0"
                      step="0.01"
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-700 font-medium">
                      {formData.type === 'percentage' ? '%' : '$'}
                    </span>
                  </div>
                  {errors.value && <p className="text-red-600 text-sm mt-1">{errors.value}</p>}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, minQuantity: e.target.value }))
                    }
                    placeholder="e.g., 10"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="e.g., SAVE20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="e.g., Special bulk discount for restaurants"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountsPage;
