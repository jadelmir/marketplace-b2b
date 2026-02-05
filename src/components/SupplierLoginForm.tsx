import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

export const SupplierLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { state } = useAuth();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password, role: 'SUPPLIER' });
  };

  // Navigate on successful login
  useEffect(() => {
    console.log('state ',state);
    if (state.user) {
      console.log('user state',state.user);
    }
    if (state.user?.role) {
      console.log('user role',state.user.role);
    }

    if (state.user && state.user.role == 'SUPPLIER') {
      console.log('we should navigate');
      
      navigate('/supplier/dashboard');
    }
  }, [state.user, navigate]);

  const errorMessage = loginMutation.error 
    ? (loginMutation.error as Error).message 
    : state.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="supplier-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="supplier-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@business.com"
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label htmlFor="supplier-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="supplier-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login as Supplier'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-green-600 hover:text-green-700 font-medium">
          Sign up
        </a>
      </p>
    </form>
  );
};
