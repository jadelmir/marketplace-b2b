import React, { useRef, useState } from 'react';
import { CategorySearchModal } from './CategorySearchModal';
import { getCategoryIcon } from '../../../utils/categoryIcons';

export interface BrowseByCategoryProps {
  displayedCategories: any[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isCategoriesLoading: boolean;
  allCategories: any[];
}

export const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({
  displayedCategories,
  selectedCategory,
  onSelectCategory,
  isCategoriesLoading,
  allCategories,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 500;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 100);
    }
  };

  React.useEffect(() => {
    // Check scroll after categories are rendered
    setTimeout(() => checkScroll(), 100);
    setTimeout(() => checkScroll(), 300);
    
    window.addEventListener('resize', checkScroll);
    
    // Set up resize observer to detect container size changes
    const resizeObserver = new ResizeObserver(() => checkScroll());
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
    };
  }, [displayedCategories]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow p-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Browse by Category</p>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search All
          </button>
        </div>

        {/* Category Scroll Container */}
        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-lg rounded-full p-2 transition-all duration-200 border border-gray-200"
              title="Scroll left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {displayedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon || getCategoryIcon(category.name)}</span>
                {category.name}
              </button>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-lg rounded-full p-2 transition-all duration-200 border border-gray-200"
              title="Scroll right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Search Modal */}
      <CategorySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        categories={allCategories}
        isLoading={isCategoriesLoading}
      />
    </div>
  );
};
