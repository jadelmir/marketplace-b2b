// Predefined icons for product categories and subcategories
export const CATEGORY_ICONS: Record<string, string> = {
  'Meat & Poultry': '🥩',
  'Produce': '🥕',
  'Dairy & Eggs': '🥛',
  'Bakery': '🍞',
  'Pantry Staples': '🥫',
  'Beverages': '🥤',
};

export const SUBCATEGORY_ICONS: Record<string, Record<string, string>> = {
  'Meat & Poultry': {
    'Beef': '🥩',
    'Chicken': '🍗',
    'Pork': '🥓',
    'Processed Meat': '🌭',
    'Fresh Meat': '🥩',
    'Poultry': '🍗',
    'Seafood': '🐟',
  },
  'Produce': {
    'Vegetables': '🥦',
    'Fruits': '🍎',
    'Herbs & Spices': '🌿',
    'Organic': '🌱',
  },
  'Dairy & Eggs': {
    'Milk': '🥛',
    'Cheese': '🧀',
    'Yogurt': '🥣',
    'Eggs': '🥚',
  },
  'Bakery': {
    'Bread': '🍞',
    'Pastries': '🥐',
    'Cakes': '🎂',
    'Buns & Rolls': '🍞',
  },
  'Pantry Staples': {
    'Rice & Grains': '🌾',
    'Pasta': '🍝',
    'Oils & Condiments': '🫙',
    'Canned Goods': '🥫',
  },
  'Beverages': {
    'Soft Drinks': '🥤',
    'Juice': '🧃',
    'Water': '💧',
    'Coffee & Tea': '☕',
  },
};

/**
 * Get the icon for a category
 * @param categoryName - The name of the category
 * @param fallback - Fallback icon if category not found
 * @returns The icon emoji for the category
 */
export const getCategoryIcon = (
  categoryName: string,
  fallback: string = '📦'
): string => {
  return CATEGORY_ICONS[categoryName] || fallback;
};

/**
 * Get the icon for a subcategory
 * @param categoryName - The parent category name
 * @param subcategoryName - The name of the subcategory
 * @param fallback - Fallback icon if subcategory not found
 * @returns The icon emoji for the subcategory
 */
export const getSubcategoryIcon = (
  categoryName: string,
  subcategoryName: string,
  fallback: string = '📦'
): string => {
  return SUBCATEGORY_ICONS[categoryName]?.[subcategoryName] || fallback;
};
