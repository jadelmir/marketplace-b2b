import { UserRole } from './../context/AuthContext';
import { apiClient } from './client';

// Auth Types
export interface BuyerLoginPayload {
  email: string;
  password: string;
}

export interface BuyerRegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface SupplierLoginPayload {
  email: string;
  password: string;
}

export interface SupplierRegisterPayload {
  email: string;
  password: string;
  company_name: string;
  location: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  access_token: string;
  created_at: string;
  user : User;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  role: UserRole;
}

// Authentication endpoints
export const buyerLogin = async (payload: BuyerLoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/buyers/login', payload);
    // API response format: { success: true, data: {...}, message, statusCode }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  } catch (error: any) {
    let message = 'Login failed. Please try again.';
    
    if (error.response?.status === 401) {
      message = 'Invalid email or password. Please check your credentials.';
    } else if (error.response?.status === 400) {
      message = error.response?.data?.message || 'Please enter valid email and password.';
    } else if (error.response?.status === 500) {
      message = 'Server error. Please try again later.';
    } else if (error.message === 'Network Error' || !error.response) {
      message = 'Cannot connect to server. Please check your internet connection.';
    } else {
      message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
    }
    
    throw new Error(message);
  }
};

export const buyerRegister = async (payload: BuyerRegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/buyers/register', payload);
    
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Registration failed');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(message);
  }
};

export const supplierLogin = async (payload: SupplierLoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/suppliers/login', payload);
    
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Login failed');
  } catch (error: any) {
    let message = 'Login failed. Please try again.';
    
    if (error.response?.status === 401) {
      message = 'Invalid email or password. Please check your credentials.';
    } else if (error.response?.status === 400) {
      message = error.response?.data?.message || 'Please enter valid email and password.';
    } else if (error.response?.status === 500) {
      message = 'Server error. Please try again later.';
    } else if (error.message === 'Network Error' || !error.response) {
      message = 'Cannot connect to server. Please check your internet connection.';
    } else {
      message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
    }
    
    throw new Error(message);
  }
};

export const supplierRegister = async (payload: SupplierRegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/suppliers/register', payload);
    
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'Registration failed');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(message);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    console.error('Logout error:', error);
  }
};
