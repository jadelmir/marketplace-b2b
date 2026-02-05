import React from 'react';
import { Product } from '../../../types';

export interface ProductCardProps {
  product: Product;
  onViewSupplier: (supplierId: string) => void;
  onOrderNow?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewSupplier,
  onOrderNow,
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex-shrink-0 w-80">
      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-bold text-blue-600">${product.price}</p>
            <p className="text-xs text-gray-500">per {product.unit}</p>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {product.category}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          MOQ: {product.moq} {product.unit} | Stock: {product.availability}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onViewSupplier(product.supplierId || '')}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
          >
            View Supplier
          </button>
          <button
            onClick={() => onOrderNow?.(product.id)}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-sm"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};
