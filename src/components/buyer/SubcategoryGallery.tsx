import React, { useState } from 'react';
import { CategoryGroup } from '../../data/categories';

interface SubcategoryGalleryProps {
  category: CategoryGroup;
  isOpen: boolean;
  onClose: () => void;
}

export const SubcategoryGallery: React.FC<SubcategoryGalleryProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 border-b px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {category.subcategories.length} subcategories
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {category.subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="flex flex-col items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer group"
                onClick={() => setSelectedImage(subcategory.image)}
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-blue-400 transition-all">
                  <img
                    src={subcategory.image}
                    alt={subcategory.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"%3E%3C/path%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>

                {/* Name & Icon */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{subcategory.icon}</span>
                  <p className="text-sm font-medium text-gray-700 text-center line-clamp-2">
                    {subcategory.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Fullscreen Modal */}
      {selectedImage && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-[60] transition-opacity"
            onClick={() => setSelectedImage(null)}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div
              className="relative max-w-3xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
