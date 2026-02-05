import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SupplierOrder, SupplierUser } from '../../types';
import { MOCK_SUPPLIER_ORDERS } from '../../data/mockSuppliers';
import { SupplierSidebar, SupplierHeader } from '../../components/supplier';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'accepted' | 'fulfilled' | 'all'>(
    'new'
  );
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

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

    // Filter orders for this supplier
    const supplierOrders = MOCK_SUPPLIER_ORDERS.filter(
      (o) => o.supplierId === state.user?.id
    );
    setOrders(supplierOrders);
  }, [state.user, isInitializing, navigate]);

  // Filter orders by tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    }
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  // Get order stats
  const stats = useMemo(() => {
    return {
      new: orders.filter((o) => o.status === 'new').length,
      accepted: orders.filter((o) => o.status === 'accepted').length,
      fulfilled: orders.filter((o) => o.status === 'fulfilled').length,
      total: orders.length,
    };
  }, [orders]);

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'accepted', acceptedAt: new Date().toISOString() }
          : o
      )
    );
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleRejectOrder = () => {
    if (rejectingOrderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === rejectingOrderId
            ? {
                ...o,
                status: 'rejected',
                rejectionReason,
                rejectionNote: rejectionReason,
              }
            : o
        )
      );
      setShowRejectModal(false);
      setRejectingOrderId(null);
      setRejectionReason('');
    }
  };

  const handleShipOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'shipped',
              shippedAt: new Date().toISOString(),
              trackingNumber: `TRACK-${Date.now()}`,
            }
          : o
      )
    );
  };

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-2">Monitor and manage all incoming orders</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              {[
                { id: 'new', label: 'New Orders', count: stats.new },
                { id: 'accepted', label: 'Accepted Orders', count: stats.accepted },
                { id: 'fulfilled', label: 'Fulfilled Orders', count: stats.fulfilled },
                { id: 'all', label: 'All Orders', count: stats.total },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as 'new' | 'accepted' | 'fulfilled' | 'all')
                  }
                  className={`px-4 py-3 font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.buyerName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Order ID: {order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'new'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-medium text-gray-900 mb-3">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-gray-600">
                                {item.quantity} {item.unit} @ ${item.pricePerUnit.toFixed(2)}/unit
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                        <p className="font-medium text-gray-900">Total Order Value</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Buyer Email</p>
                        <p className="font-medium text-gray-900">
                          {order.buyerEmail || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery Address</p>
                        <p className="font-medium text-gray-900">
                          {order.deliveryAddress || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {order.specialInstructions && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                        <p className="text-gray-600">Special Instructions</p>
                        <p className="text-gray-900">{order.specialInstructions}</p>
                      </div>
                    )}

                    {order.rejectionReason && (
                      <div className="bg-red-50 rounded-lg p-3 mb-4 text-sm">
                        <p className="text-gray-600">Rejection Reason</p>
                        <p className="text-gray-900">{order.rejectionReason}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      {order.status === 'new' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => {
                              setRejectingOrderId(order.id);
                              setShowRejectModal(true);
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                          >
                            Reject Order
                          </button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleShipOrder(order.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => {
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === order.id
                                  ? {
                                      ...o,
                                      status: 'fulfilled',
                                      fulfilledAt: new Date().toISOString(),
                                    }
                                  : o
                              )
                            );
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                        >
                          Mark as Fulfilled
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition"
                      >
                        View Details
                      </button>
                    </div>
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium text-lg">No orders yet</p>
                  <p className="text-gray-400">
                    Orders will appear here once buyers place them
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-900">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Buyer Information</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium text-gray-900">{selectedOrder.buyerName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {selectedOrder.buyerEmail || 'N/A'}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Delivery Address:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {selectedOrder.deliveryAddress || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.pricePerUnit.toFixed(2)}/unit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${selectedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Close
              </button>
              {selectedOrder.status === 'new' && (
                <button
                  onClick={() => {
                    handleAcceptOrder(selectedOrder.id);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Accept Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Order Modal */}
      {showRejectModal && rejectingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reject Order</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this order
              </p>

              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-4"
              >
                <option value="">Select a reason...</option>
                <option value="Stock not available">Stock not available</option>
                <option value="Item discontinued">Item discontinued</option>
                <option value="Unable to fulfill">Unable to fulfill</option>
                <option value="Other">Other reason</option>
              </select>

              {rejectionReason === 'Other' && (
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please enter your reason..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-4"
                  rows={3}
                />
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingOrderId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                disabled={!rejectionReason}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
