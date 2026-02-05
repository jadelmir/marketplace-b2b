/**
 * B2B Marketplace Categories & Subcategories
 * Netflix-style horizontal scrolling categories for buyer search
 * Categories are loaded from categoriesData.json for easy management
 */

import categoriesData from './categoriesData.json';

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  image: string; // Image URL
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  image: string; // Category banner image
  subcategories: SubCategory[];
}

/**
 * Main product categories with subcategories loaded from JSON
 */
export const PRODUCT_CATEGORIES: CategoryGroup[] = categoriesData.categories;

/**
 * Featured products/suppliers for homepage
 */
export const FEATURED_CATEGORY = {
  id: 'featured',
  name: 'Featured Suppliers',
  icon: '⭐',
};

/**
 * Recently searched/viewed for user
 */
export const RECENT_CATEGORY = {
  id: 'recent',
  name: 'Recent Searches',
  icon: '🕐',
};

/**
 * Trending products
 */
export const TRENDING_CATEGORY = {
  id: 'trending',
  name: 'Trending Now',
  icon: '🔥',
};

/**
 * Best deals/discounts
 */
export const DEALS_CATEGORY = {
  id: 'deals',
  name: 'Best Deals',
  icon: '💰',
};

/**
 * Quick filters helper function
 */
export const getCategoryByName = (categoryName: string): CategoryGroup | undefined => {
  return PRODUCT_CATEGORIES.find((cat) => cat.name === categoryName);
};

export const getSubcategoryByName = (
  categoryName: string,
  subcategoryName: string
): SubCategory | undefined => {
  const category = getCategoryByName(categoryName);
  return category?.subcategories.find((sub) => sub.name === subcategoryName);
};

/**
 * Get all subcategory names for a category
 */
export const getSubcategoryNames = (categoryName: string): string[] => {
  const category = getCategoryByName(categoryName);
  return category?.subcategories.map((sub) => sub.name) || [];
};
