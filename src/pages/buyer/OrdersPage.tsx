import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';
import { useGetBuyerOrders } from '../../hooks/useQueries';

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
  };

  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data: orders = [], isLoading } = useGetBuyerOrders();

  const handleReorder = (order: Order) => {
    // In a real app, add items to cart and navigate
    alert(`Reordering from ${order.supplierName}`);
    navigate('/buyer/search');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg
          className="w-20 h-20 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">Start by searching for products and placing your first order</p>
        <button
          onClick={() => navigate('/buyer/search')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600">View and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-gray-600">
                  From: {order.supplierName}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                <p className="font-medium text-gray-900">{order.items.length} product(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                <p className="font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</p>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    • {item.productName} - {item.quantity} {item.unit} @ ${item.price}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm"
              >
                View Details
              </button>
              <button
                onClick={() => handleReorder(order)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Details</h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                <p className="font-medium text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Supplier</p>
                <p className="font-medium text-gray-900">{selectedOrder.supplierName}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.productName}</span>
                    <span className="font-medium text-gray-900">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ${selectedOrder.totalPrice.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
