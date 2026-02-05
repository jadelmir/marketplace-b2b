import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { usePlaceOrder } from '../../hooks/useMutations';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, removeItem, updateQuantity, clearCart } = useCart();
  const placeOrderMutation = usePlaceOrder();

  const handlePlaceOrder = async () => {
    if (cartState.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!cartState.supplierId) {
      alert('No supplier selected');
      return;
    }

    placeOrderMutation.mutate(
      {
        supplierId: cartState.supplierId,
        items: cartState.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          alert('Order placed successfully!');
          clearCart();
          navigate('/buyer/orders');
        },
        onError: (error) => {
          alert('Failed to place order');
          console.error(error);
        },
      }
    );
  };

  if (cartState.items.length === 0) {
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping to add products to your cart</p>
        <button
          onClick={() => navigate('/buyer/search')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> You can only order from one supplier at a time. Adding items from another supplier will replace your current cart.
          </p>
        </div>

        <div className="space-y-3">
          {cartState.items.map((cartItem) => (
            <div key={cartItem.product.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{cartItem.product.name}</h3>
                  <p className="text-sm text-gray-600">{cartItem.product.description}</p>
                </div>
                <button
                  onClick={() => removeItem(cartItem.product.id)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">${cartItem.product.price} each</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          cartItem.product.id,
                          Math.max(cartItem.quantity - 1, cartItem.product.moq ?? 1)
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-l border-r border-gray-300 font-medium">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(cartItem.product.id, cartItem.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  ${((typeof cartItem.product.price === 'string' ? parseFloat(cartItem.product.price) : cartItem.product.price) * cartItem.quantity).toFixed(2)}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Unit: {cartItem.product.unit} | MOQ: {cartItem.product.moq}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Items</span>
            <span className="font-medium text-gray-900">{cartState.items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              ${cartState.totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">TBD</span>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ${cartState.totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold transition-colors mb-3"
        >
          {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
        </button>

        <button
          onClick={() => navigate('/buyer/search')}
          className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Continue Shopping
        </button>

        <button
          onClick={() => clearCart()}
          className="w-full py-2 mt-3 text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
