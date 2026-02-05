import { useQuery } from '@tanstack/react-query';
import { searchProducts, getAllProducts, getSuppliers, getSupplierById, getSupplierProducts } from '../api/products';

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: getAllProducts,
  });
};

export const useSearchProducts = (query?: string, category?: string) => {
  return useQuery({
    queryKey: ['products', 'search', query, category],
    queryFn: () => searchProducts(query, category),
  });
};

export const useGetSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });
};

export const useGetSupplierById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => getSupplierById(id!),
    enabled: !!id,
  });
};

export const useGetSupplierProducts = (supplierId: string | undefined) => {
  
  return useQuery({
    queryKey: ['suppliers', supplierId, 'products'],
    queryFn: () => getSupplierProducts(supplierId!),
    enabled: !!supplierId,
  });
};
