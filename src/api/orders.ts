import { apiClient } from './client';
import { Order } from '../types';

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
    throw new Error('Invalid response format');
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch orders';
    throw new Error(message);
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
