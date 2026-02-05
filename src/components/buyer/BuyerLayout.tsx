import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const BuyerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useAuth();
  const { state: cartState } = useCart();

  const handleLogout = () => {
    authDispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              onClick={() => navigate('/buyer/search')}
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">B2B Marketplace</h1>
                <p className="text-xs text-gray-500">Buyer Dashboard</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => navigate('/buyer/search')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Search
              </button>
              <button
                onClick={() => navigate('/buyer/orders')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Orders
              </button>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={() => navigate('/buyer/cart')}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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
              {cartState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartState.items.length}
                </span>
              )}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{authState.user?.name}</p>
                <p className="text-xs text-gray-500">{authState.user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold">
                  {authState.user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
