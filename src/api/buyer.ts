import axios from 'axios';
import categoriesData from '../data/categoriesData.json';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '../data/mockProducts';
import { Category, Order, Product, Supplier } from '../types';

const API_BASE = 'http://localhost:3001/api';

// Create axios instance with token support
const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  token: string;
  created_at: string;
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
    const message = error.response?.data?.message || error.message || 'Login failed';
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
    const message = error.response?.data?.message || error.message || 'Login failed';
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

// Search & Browse
export const searchProducts = async (
  query?: string,
  category?: string
): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/suppliers/products/search', {
      params: { searchTerm: query, category },
    });
    // API response format: { success: true, data: [...], message, statusCode }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    // If success but data is array (for some APIs)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Failed to fetch products from API, using mock data:', error);
    // Fallback to mock data if API fails
    let filtered = MOCK_PRODUCTS;
    
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    
    if (category) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    return filtered;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // Fallback to categoriesData.json
    return categoriesData.categories as any;
  } catch (error) {
    console.warn('Failed to fetch categories from API, using default categories:', error);
    // Fallback to categoriesData.json
    return categoriesData.categories as any;
  }
};

export const getSubcategories = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/categories/subcategories');
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Failed to fetch subcategories from API:', error);
    return [];
  }
};

export const getSubcategoriesByCategory = async (categoryId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn(`Failed to fetch subcategories for category ${categoryId}:`, error);
    return [];
  }
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await apiClient.get('/suppliers');
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Failed to fetch suppliers, using mock data:', error);
    // Fallback to mock data
    return MOCK_SUPPLIERS;
  }
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  try {
    const response = await apiClient.get(`/suppliers/${id}`);
    // API response format: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn(`Failed to fetch supplier ${id}, using mock data:`, error);
    // Fallback to mock data
    const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
    if (supplier) return supplier;
    throw error;
  }
};

export const getSupplierProducts = async (supplierId: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/suppliers/${supplierId}/products`);
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn(`Failed to fetch products for supplier ${supplierId}, using mock data:`, error);
    // Fallback to mock data
    return MOCK_PRODUCTS.filter((p) => p.supplierId === supplierId);
  }
};

// Cart & Orders
export const placeOrder = async (
  supplierId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<Order> => {
  try {
    const response = await apiClient.post('/orders', {
      supplierId,
      items,
    });
    // API response format: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to place order';
    throw new Error(message);
  }
};

export const getBuyerOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get('/orders');
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error: any) {
    console.warn('Failed to fetch orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    // API response format: { success: true, data: {...} }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch order';
    throw new Error(message);
  }
};


// Import mock data from data folder instead of defining here
