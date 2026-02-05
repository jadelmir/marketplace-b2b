import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

export const BuyerLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { state } = useAuth();
  const loginMutation = useLogin();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    loginMutation.mutate({ email, password, role: 'BUYER' });
  };

  // Clear validation error when user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
  };

  // Navigate on successful login
  useEffect(() => {
    if (state.user && state.user.role === 'BUYER') {
      navigate('/buyer/search');
    }
  }, [state.user, navigate]);

  const errorMessage = loginMutation.error 
    ? (loginMutation.error as Error).message 
    : state.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="buyer-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="your@email.com"
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {validationErrors.email && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="buyer-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="buyer-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            validationErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {validationErrors.password && (
          <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-red-800 font-medium text-sm">Login Failed</p>
            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending || Object.keys(validationErrors).length > 0}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login as Buyer'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </a>
      </p>
    </form>
  );
};
