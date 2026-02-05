import React, { useState } from 'react';
import { BuyerLoginForm } from '../components/BuyerLoginForm';
import { SupplierLoginForm } from '../components/SupplierLoginForm';
import { getCurrentEnvironment } from '../utils/environment';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer');
  const environment = getCurrentEnvironment();
  console.log(activeTab);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            B2B Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Connect restaurants with suppliers
          </p>
        </div>

        {/* Split Login Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer Login */}
          <div
            className={`p-8 rounded-lg transition-all duration-300 cursor-pointer border-2 ${
              activeTab === 'buyer'
                ? 'border-blue-600 bg-white shadow-lg'
                : 'border-gray-200 bg-gray-50 shadow-sm hover:shadow-md'
            }`}
            onClick={() => setActiveTab('buyer')}
          >
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Buyers</h2>
              <p className="text-gray-600 text-sm mt-2">
                Restaurants & food service businesses
              </p>
            </div>

            <div className="mb-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Search & discover suppliers
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  View transparent pricing
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Place and track orders
                </li>
              </ul>
            </div>

            {activeTab === 'buyer' && (
              <div className="animate-in fade-in duration-300">
                <BuyerLoginForm />
              </div>
            )}

            {activeTab !== 'buyer' && (
              <button
                onClick={() => setActiveTab('buyer')}
                className="w-full px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Switch to Buyer Login
              </button>
            )}
          </div>

          {/* Supplier Login */}
          <div
            className={`p-8 rounded-lg transition-all duration-300 cursor-pointer border-2 ${
              activeTab === 'supplier'
                ? 'border-green-600 bg-white shadow-lg'
                : 'border-gray-200 bg-gray-50 shadow-sm hover:shadow-md'
            }`}
            onClick={() => setActiveTab('supplier')}
          >
            <div className="mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Suppliers</h2>
              <p className="text-gray-600 text-sm mt-2">
                Food & ingredient suppliers
              </p>
            </div>

            <div className="mb-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Manage your catalog
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Receive & manage orders
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Set pricing & availability
                </li>
              </ul>
            </div>

            {activeTab === 'supplier' && (
              <div className="animate-in fade-in duration-300">
                <SupplierLoginForm />
              </div>
            )}

            {activeTab !== 'supplier' && (
              <button
                onClick={() => setActiveTab('supplier')}
                className="w-full px-4 py-2 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
              >
                Switch to Supplier Login
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            By logging in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Environment Badge - Bottom Right */}
        <div className="fixed bottom-4 right-4">
          <div className={`px-4 py-2 rounded-lg text-xs font-semibold ${environment.color}`}>
            {environment.name.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
