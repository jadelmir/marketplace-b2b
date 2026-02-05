import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useGetSupplierById, useGetSupplierProducts } from '../../hooks/useQueries';
import { Product } from '../../types';

export const SupplierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: supplier, isLoading: supplierLoading, error: supplierError } = useGetSupplierById(id);
  const { data: products = [], isLoading: productsLoading } = useGetSupplierProducts(id);

  const handleAddToCart = (product: Product) => {
    if (quantity < (product.moq ?? 0)) {
      alert(`Minimum order quantity is ${product.moq ?? 0} ${product.unit}`);
      return;
    }
    addItem({
      product,
      quantity,
      supplierId: product.supplierId || '',
    });
    setQuantity(1);
    alert(`${product.name} added to cart!`);
    navigate('/buyer/cart');
  };

  if (supplierLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (supplierError || !supplier) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Supplier not found</p>
        <button
          onClick={() => navigate('/buyer/search')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Supplier Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
              <p className="text-gray-600">{supplier.address}, {supplier.city}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-2xl font-bold text-yellow-500">{supplier.rating}</span>
              <span className="text-yellow-500">★</span>
            </div>
            <p className="text-sm text-gray-600">{supplier.totalReviews} reviews</p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{supplier.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{supplier.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium text-gray-900">{supplier.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="font-medium text-gray-900">{products.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-medium text-gray-900">
              {new Date(supplier.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products available</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium">Unit:</span> {product.unit}
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium">MOQ:</span> {product.moq} {product.unit}
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium">Stock:</span> {product.availability}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Cart Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-600 mb-4">${selectedProduct.price} per {selectedProduct.unit}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (Minimum: {selectedProduct.moq} {selectedProduct.unit})
              </label>
              <input
                type="number"
                min={selectedProduct.moq ?? 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(selectedProduct.moq ?? 1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-blue-600">
                ${((typeof selectedProduct.price === 'string' ? parseFloat(selectedProduct.price) : selectedProduct.price) * quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
