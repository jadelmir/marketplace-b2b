import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllProducts, useGetCategories } from '../../../hooks/useQueries';
import { Product } from '../../../types';
import { BrowseByCategory } from './BrowseByCategory';
import { CategorySection } from './CategorySection';
import { OrderConfirmModal } from './OrderConfirmModal';
import { SubcategoriesSection } from './SubcategoriesSection';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategoryData, setSelectedSubcategoryData] = useState<any>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
  // Fetch categories from API
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();
    console.log('categories are ',categories);
    
  // Show all categories
  const displayedCategories = categories;

  React.useEffect(() => {
    // Component mounted, ready to display
    return () => {};
  }, []);

  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProducts();

  // Debug: log all products
  React.useEffect(() => {
    console.log('All Products:', products);
  }, [products]);

  // Get the selected category data
  const selectedCategoryData = React.useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((cat) => cat.id === selectedCategory);
  }, [selectedCategory, categories]);

  // Featured products (highest priced / premium items)
  const featuredProducts = React.useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return bPrice - aPrice;
      })
      .slice(0, 5);
  }, [products]);

  // Featured deals (products with lower MOQ or high availability)
  const featuredDeals = React.useMemo(() => {
    return [...products]
      .filter((p) => (p.moq ?? 0) <= 5 && (p.availability ?? 0) > 100)
      .sort((a, b) => {
        const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
        const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
        return aPrice - bPrice;
      })
      .slice(0, 5);
  }, [products]);

  // Suggested products (random selection for personalization)
  const suggestedProducts = React.useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [products]);

  // Group products by category
  const groupedProducts = React.useMemo(() => {
    const groups: { [key: string]: Product[] } = {};

    products.forEach((product) => {
      const category = product.category ?? 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });

    return groups;
  }, [products]);

  // Filter products based on selected category
  const filteredGroupedProducts = React.useMemo(() => {
    const filtered: { [key: string]: Product[] } = {};

    Object.entries(groupedProducts).forEach(([category, categoryProducts]) => {
      // Filter by selected category if any
      if (selectedCategory) {
        const categoryData = categories.find((cat) => cat.id === selectedCategory);
        if (categoryData?.name !== category) {
          return;
        }
      }

      if (categoryProducts.length > 0) {
        filtered[category] = categoryProducts;
      }
    });

    return filtered;
  }, [groupedProducts, selectedCategory, categories]);

  const handleOrderNow = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setOrderModalOpen(true);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Reset subcategory when category changes
    setSelectedSubcategoryData(null);
  };

  const handleConfirmOrder = (productId: string, supplierId: string, quantity: number) => {
    navigate(`/buyer/cart?productId=${productId}&supplierId=${supplierId}&quantity=${quantity}`);
  };

  return (
    <div className="space-y-6">
      {/* Browse by Category Section */}
      <BrowseByCategory
        displayedCategories={displayedCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        isCategoriesLoading={isCategoriesLoading}
        allCategories={categories}
      />

      {/* Show featured sections only when no category or subcategory is selected */}
      {!selectedCategory && !selectedSubcategoryData ? (
        <>
          {/* Featured Products Section */}
          <CategorySection
            title="Featured Products"
            icon="⭐"
            products={featuredProducts}
            isLoading={productsLoading}
            error={productsError}
            onViewSupplier={(supplierId) => navigate(`/buyer/supplier/${supplierId}`)}
            onOrderNow={handleOrderNow}
          />

          {/* Featured Deals Section */}
          <CategorySection
            title="Featured Deals"
            icon="🎉"
            products={featuredDeals}
            isLoading={productsLoading}
            error={productsError}
            onViewSupplier={(supplierId) => navigate(`/buyer/supplier/${supplierId}`)}
            onOrderNow={handleOrderNow}
          />

          {/* Suggested Products Section */}
          <CategorySection
            title="Suggested for You"
            icon="💡"
            products={suggestedProducts}
            isLoading={productsLoading}
            error={productsError}
            onViewSupplier={(supplierId) => navigate(`/buyer/supplier/${supplierId}`)}
            onOrderNow={handleOrderNow}
          />
        </>
      ) : (
        <>
          {/* Subcategories Section */}
          <SubcategoriesSection
            selectedCategoryData={selectedCategoryData}
            selectedSubcategoryData={selectedSubcategoryData}
            onSelectSubcategory={setSelectedSubcategoryData}
            products={products}
            onOrderNow={handleOrderNow}
          />

          {/* Product Sections */}
          {selectedCategory ? null :  
          <div>
            {Object.entries(filteredGroupedProducts).length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 012.646 2.646 9.003 9.003 0 0115.354 20.354z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              Object.entries(filteredGroupedProducts).map(([categoryName, categoryProducts]) => {
                const categoryData = categories.find((cat) => cat.name === categoryName);
                return (
                  <CategorySection
                    key={categoryName}
                    title={categoryName}
                    icon={categoryData?.icon}
                    products={categoryProducts}
                    isLoading={productsLoading}
                    error={productsError}
                    onViewSupplier={(supplierId) => navigate(`/buyer/supplier/${supplierId}`)}
                    onOrderNow={handleOrderNow}
                  />
                );
              })
            )}
          </div>
}
        </>
      )}

      {/* Order Confirmation Modal */}
      <OrderConfirmModal
        isOpen={orderModalOpen}
        product={selectedProduct}
        onClose={() => setOrderModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
};
