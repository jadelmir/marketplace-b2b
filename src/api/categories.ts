import { apiClient } from './client';
import { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    // API response format: { success: true, data: [...] }
    if (response.data?.success && Array.isArray(response.data?.data)) {
      const categories = response.data.data;
      // Fetch subcategories and map them into categories
      const subcatsResponse = await apiClient.get('/categories/subcategories');
      const subcats = subcatsResponse.data?.data || [];
      
      // Group subcategories by category_id
      const subcatsByCategory = subcats.reduce((acc: any, sub: any) => {
        if (!acc[sub.category_id]) {
          acc[sub.category_id] = [];
        }
        acc[sub.category_id].push(sub);
        return acc;
      }, {});
      
      // Attach subcategories to each category
      return categories.map((cat: any) => ({
        ...cat,
        subcategories: subcatsByCategory[cat.id] || []
      }));
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch categories';
    throw new Error(message);
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
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch subcategories';
    throw new Error(message);
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
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || `Failed to fetch subcategories for category ${categoryId}`;
    throw new Error(message);
  }
};
