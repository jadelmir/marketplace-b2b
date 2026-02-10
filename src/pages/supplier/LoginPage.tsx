import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_SUPPLIERS } from '../../data/mockSuppliers';

const SupplierLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Demo mode - allow login with any credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      // Bypass authentication - accept any credentials
      const supplier = {
        id: `sup_${Date.now()}`,
        email: email,
        password: password,
        companyName: email.split('@')[0],
        contactName: 'Supplier',
        phone: '+1-555-0000',
        businessAddress: 'Business Address',
        businessLicense: 'BL-' + Date.now(),
        description: 'Supplier company',
        specialties: ['1', '2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store supplier info in localStorage
      localStorage.setItem('supplierAuth', JSON.stringify(supplier));
      localStorage.setItem('supplierId', supplier.id);
      navigate('/supplier/dashboard');
      setLoading(false);
    }, 500);
  };

  // Demo login helper
  const handleDemoLogin = (supplierEmail: string) => {
    setEmail(supplierEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg mb-4">
            <svg
              className="w-7 h-7 text-white"
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
          <h1 className="text-3xl font-bold text-gray-900">Supplier Portal</h1>
          <p className="text-gray-600 mt-2">Manage your business efficiently</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supplier@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo Mode - Any credentials work</span>
            </div>
          </div>

          {/* Demo Login Options */}
          <div className="space-y-2">
            {MOCK_SUPPLIERS.map((supplier) => (
              <button
                key={supplier.id}
                type="button"
                onClick={() => handleDemoLogin(supplier.email)}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left"
              >
                <div className="font-medium text-gray-900">{supplier.companyName}</div>
                <div className="text-xs text-gray-600">{supplier.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Back to Buyer Portal */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Are you a buyer?{' '}
            <Link
              to="/buyer/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Go to buyer portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierLoginPage;
