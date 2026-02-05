import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../types';
import { getSubcategoryImage } from '../../../utils/categoryImages';
import { getSubcategoryIcon } from '../../../utils/categoryIcons';

export interface SubcategoriesSectionProps {
  selectedCategoryData: any;
  selectedSubcategoryData: any;
  onSelectSubcategory: (subcategoryData: any | null) => void;
  products: Product[];
  onOrderNow: (productId: string) => void;
}

export const SubcategoriesSection: React.FC<SubcategoriesSectionProps> = ({
  selectedCategoryData,
  selectedSubcategoryData,
  onSelectSubcategory,
  products,
  onOrderNow,
}) => {
  const navigate = useNavigate();
    console.log(selectedSubcategoryData , 'here data');
    
  if (!selectedCategoryData) return null;

  return (
    <div className="mb-8">
      {/* <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={selectedCategoryData.image || getCategoryImage(selectedCategoryData.name)}
            alt={selectedCategoryData.name}
            className="h-24 w-24 object-cover rounded-lg shadow"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span>{selectedCategoryData.icon}</span>
              {selectedCategoryData.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {selectedCategoryData.subcategories?.length ?? 0} subcategories
            </p>
          </div>
        </div>
      </div> */}

      {!selectedSubcategoryData && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Browse by Subcategory</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedCategoryData.subcategories?.map((subcategory: any) => {
              const imageUrl = subcategory.image || getSubcategoryImage(selectedCategoryData.name, subcategory.name);
              console.log(`${subcategory.name} image:`, imageUrl);
              return (
              <div
                key={subcategory.id}
                onClick={() => onSelectSubcategory(subcategory)}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden cursor-pointer group ${
                  selectedSubcategoryData?.id === subcategory.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={subcategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Failed to load image for ${subcategory.name}:`, e);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{subcategory.icon || getSubcategoryIcon(selectedCategoryData.name, subcategory.name)}</span>
                    <p className="font-medium text-gray-900 text-sm">{subcategory.name}</p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}

      {/* Subcategory Products Section */}
      {selectedSubcategoryData && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <button
              onClick={() => onSelectSubcategory(null)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
            >
              ← Back to subcategories
            </button>
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedCategoryData?.name}
            </h3>
            <p className="text-gray-600 mt-1">
              All suppliers and products
            </p>
          </div>

          {(() => {
            console.log("products", products);
            console.log('selectedsubcategory' , selectedSubcategoryData);
            
            
            const subcategoryProducts = products.filter(
              (p) => p.subcategory_id === selectedSubcategoryData?.id
            );

            if (subcategoryProducts.length === 0) {
              return (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found for {selectedCategoryData?.name}</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategoryProducts.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      {/* Price Section */}
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Price</p>
                        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                        <p className="text-xs text-gray-600 mt-1">per {product.unit}</p>
                      </div>

                      {/* Supplier & Details */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Supplier</p>
                          <p className="text-sm font-medium text-gray-900">Supplier ID: {product.supplierId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Minimum Order</p>
                          <p className="text-sm font-medium text-gray-900">
                            {product.moq} {product.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Availability</p>
                          <p className="text-sm font-medium text-green-600">{product.availability} in stock</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/buyer/supplier/${product.supplierId}`)}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          View Supplier
                        </button>
                        <button
                          onClick={() => onOrderNow(product.id)}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
