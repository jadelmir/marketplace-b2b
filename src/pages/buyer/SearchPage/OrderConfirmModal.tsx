import React, { useState } from 'react';
import { Product } from '../../../types';

export interface OrderConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string, supplierId: string, quantity: number) => void;
}

export const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const totalPrice = product ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price) * quantity : 0;

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Order</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Price per unit</p>
              <p className="text-2xl font-bold text-blue-600">${product.price}</p>
              <p className="text-xs text-gray-500 mt-1">per {product.unit}</p>
            </div>
          </div>

          {/* Quantity Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quantity (Minimum Order: {product.moq} {product.unit})
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="flex-1 text-center text-lg font-semibold border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            {quantity < (product.moq ?? 0) && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Quantity must be at least {product.moq ?? 0} {product.unit}
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Unit Price:</span>
              <span className="font-semibold text-gray-900">${product.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-semibold text-gray-900">{quantity} {product.unit}</span>
            </div>
            <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Availability Check */}
          {quantity > (product.availability ?? 0) && (
            <div className="bg-red-50 p-3 rounded-lg mb-6">
              <p className="text-sm text-red-700">
                ⚠️ Only {product.availability ?? 0} {product.unit} available in stock
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(product.id, product.supplierId || '', quantity);
                onClose();
              }}
              disabled={quantity < (product.moq ?? 0) || quantity > (product.availability ?? 0)}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
