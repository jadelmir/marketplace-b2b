import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

export const SupplierLoginForm: React.FC = () => {
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

    loginMutation.mutate({ email, password, role: 'SUPPLIER' });
  };

  // Validate in real-time as user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    const errors = { ...validationErrors };
    if (!newEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      errors.email = 'Please enter a valid email address';
    } else {
      delete errors.email;
    }
    setValidationErrors(errors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    const errors = { ...validationErrors };
    if (!newPassword) {
      errors.password = 'Password is required';
    } else if (newPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else {
      delete errors.password;
    }
    setValidationErrors(errors);
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
          onChange={handleEmailChange}
          placeholder="your@business.com"
          required
          className={`mt-1 w-full px-4 py-2 border-2 rounded-md outline-none transition-all ${
            validationErrors.email
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400'
              : 'border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500'
          }`}
        />
        {validationErrors.email && (
          <div className="mt-2 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 text-sm">{validationErrors.email}</p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="supplier-password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="supplier-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          required
          className={`mt-1 w-full px-4 py-2 border-2 rounded-md outline-none transition-all ${
            validationErrors.password
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300 focus:border-red-400'
              : 'border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500'
          }`}
        />
        {validationErrors.password && (
          <div className="mt-2 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 text-sm">{validationErrors.password}</p>
          </div>
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
        className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login as Supplier'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};
