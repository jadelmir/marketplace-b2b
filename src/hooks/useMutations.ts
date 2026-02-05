import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct, deleteProduct, CreateProductPayload, UpdateProductPayload } from '../api/products';
import { Product } from '../types';

// Re-export mutation hooks from feature-based modules for backward compatibility
export { usePlaceOrder } from './useOrders';
export { useBuyerLogin, useBuyerRegister, useSupplierLogin, useSupplierRegister, useLogout } from './useAuth';

// Product Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload): Promise<Product> => {
      return createProduct(payload);
    },
    onSuccess: () => {
      // Invalidate supplier products queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
        refetchType: 'active',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: UpdateProductPayload }): Promise<Product> => {
      return updateProduct(productId, data);
    },
    onSuccess: () => {
      // Invalidate supplier products queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
        refetchType: 'active',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string): Promise<void> => {
      return deleteProduct(productId);
    },
    onSuccess: () => {
      // Invalidate supplier products queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['suppliers'],
        refetchType: 'active',
      });
    },
  });
};
