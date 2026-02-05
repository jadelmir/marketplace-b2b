// Predefined images for product categories
export const CATEGORY_IMAGES: Record<string, string> = {
  'Meat & Poultry': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=400&fit=crop',
  'Produce': 'https://images.unsplash.com/photo-1112707d298e528667f720db1d7e140a50e2394f?w=400&h=400&fit=crop',
  'Dairy & Eggs': 'https://images.unsplash.com/photo-1619976829552-a85a9eaafc48?w=400&h=400&fit=crop',
  'Bakery': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
  'Pantry Staples': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd84b61?w=400&h=400&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
};

export const SUBCATEGORY_IMAGES: Record<string, Record<string, string>> = {
  'Meat & Poultry': {
    'Beef': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    'Chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    'Pork': 'https://images.unsplash.com/photo-1690983321750-ad6f6d59a84b?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Processed Meats': 'https://images.pexels.com/photos/14592873/pexels-photo-14592873.jpeg',
    'Fresh Meat': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=300&h=300&fit=crop',
    'Poultry': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=300&fit=crop',
    'Seafood': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  'Produce': {
    'Vegetables': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
    'Fruits': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
    'Herbs & Spices': 'https://images.unsplash.com/photo-1596040707706-893b34f1e0d9?w=300&h=300&fit=crop',
    'Organic': 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=300&h=300&fit=crop',
  },
  'Dairy & Eggs': {
    'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop',
    'Cheese': 'https://images.unsplash.com/photo-1452195917615-1d979802278c?w=300&h=300&fit=crop',
    'Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291840?w=300&h=300&fit=crop',
    'Eggs': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd84b61?w=300&h=300&fit=crop',
  },
  'Bakery': {
    'Bread': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
    'Pastries': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
    'Cakes': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
    'Buns & Rolls': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&h=300&fit=crop',
  },
  'Pantry Staples': {
    'Rice & Grains': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
    'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop',
    'Oils & Condiments': 'https://images.unsplash.com/photo-1596040707706-893b34f1e0d9?w=300&h=300&fit=crop',
    'Canned Goods': 'https://images.unsplash.com/photo-1535594645429-f8bc9f2a6c45?w=300&h=300&fit=crop',
  },
  'Beverages': {
    'Soft Drinks': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&h=300&fit=crop',
    'Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop',
    'Water': 'https://images.unsplash.com/photo-1594203371392-7d039e60dd6f?w=300&h=300&fit=crop',
    'Coffee & Tea': 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=300&h=300&fit=crop',
  },
};

/**
 * Get the image URL for a category
 * @param categoryName - The name of the category
 * @param fallback - Fallback image URL if category not found
 * @returns The image URL for the category
 */
export const getCategoryImage = (
  categoryName: string,
  fallback: string = 'https://images.unsplash.com/photo-1585238341710-4b4e6ceaf799?w=400&h=400&fit=crop'
): string => {
  return CATEGORY_IMAGES[categoryName] || fallback;
};

/**
 * Get the image URL for a subcategory
 * @param categoryName - The parent category name
 * @param subcategoryName - The name of the subcategory
 * @param fallback - Fallback image URL if subcategory not found
 * @returns The image URL for the subcategory
 */
export const getSubcategoryImage = (
  categoryName: string,
  subcategoryName: string,
  fallback: string = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'
): string => {
  return SUBCATEGORY_IMAGES[categoryName]?.[subcategoryName] || fallback;
};
