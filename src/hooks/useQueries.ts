// Re-export all query hooks from feature-based modules for backward compatibility
export { useSearchProducts, useGetAllProducts } from './useProducts';
export { useGetCategories, useGetSubcategories, useGetSubcategoriesByCategory } from './useCategories';
export { useGetSuppliers, useGetSupplierById, useGetSupplierProducts } from './useProducts';
export { useGetBuyerOrders, useGetOrderById } from './useOrders';
