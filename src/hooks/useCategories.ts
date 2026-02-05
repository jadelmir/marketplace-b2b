import { useQuery } from '@tanstack/react-query';
import { getCategories, getSubcategories, getSubcategoriesByCategory } from '../api/categories';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useGetSubcategories = () => {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: getSubcategories,
  });
};

export const useGetSubcategoriesByCategory = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => getSubcategoriesByCategory(categoryId!),
    enabled: !!categoryId,
  });
};
