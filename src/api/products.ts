import { apiClient } from './client';
import { Product, Supplier } from '../types';

// Helper: Get supplier_id from localStorage (stored during login)
const getSupplierIdFromStorage = (): string | null => {
  return localStorage.getItem('userId');
};

// Search & Browse Products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/suppliers/products');
    // API response format: { success: true, data: [...], message, statusCode }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    // If success but data is array (for some APIs)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch products';
    throw new Error(message);
  }
};

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
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch products';
    throw new Error(message);
  }
};

// Suppliers
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
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch suppliers';
    throw new Error(message);
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
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || `Failed to fetch supplier ${id}`;
    throw new Error(message);
  }
};

export const getSupplierProducts = async (supplierId: string): Promise<Product[]> => {
  try {
    console.log('Fetching products for supplierId:', supplierId);
    const response = await apiClient.get(`/suppliers/${supplierId}/products`);
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || `Failed to fetch products for supplier ${supplierId}`;
    throw new Error(message);
  }
};

// Create Product
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  subcategory_id: string;
  sku?: string;
  image_url?: string;
  supplier_id?: string;
}

export const createProduct = async (productData: CreateProductPayload): Promise<Product> => {
  try {
    // Add supplier_id from localStorage if not provided
    const payload = {
      ...productData,
      supplier_id: productData.supplier_id || getSupplierIdFromStorage(),
    };
    console.log('payload being sent is' , payload);
    
    const response = await apiClient.post('/suppliers/products', payload);
    // API response format: { success: true, data: {...}, message, statusCode }
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create product';
    throw new Error(message);
  }
};

// Update Product
export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: string;
  subcategory_id?: string;
  sku?: string;
  image_url?: string;
}

export const updateProduct = async (productId: string, productData: UpdateProductPayload): Promise<Product> => {
  try {
    const response = await apiClient.put(`/suppliers/products/${productId}`, productData);
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update product';
    throw new Error(message);
  }
};

// Delete Product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/suppliers/products/${productId}`);
    if (!response.data?.success && !response.status) {
      throw new Error('Failed to delete product');
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete product';
    throw new Error(message);
  }
};
