'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ArrowLeft } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function ProductFilters({
  categories,
  brands,
  onFilterChange,
  isMobile = false,
  onClose,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(isMobile);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedBrand, setSelectedBrand] = useState<string>();
  const [priceRange, setPriceRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedBrand(undefined);
    setPriceRange({});
    onFilterChange({});
  };

  // Handle closing the filter panel
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="relative">
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-xs bg-card dark:bg-card/95 shadow-xl z-50 lg:relative lg:top-auto lg:right-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:shadow-none border-l border-border overflow-y-auto"
            >
              <div className="p-4 border-b border-border sticky top-0 bg-card dark:bg-card/95 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-medium text-foreground">Filters</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6 text-foreground">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => {
                            setSelectedCategory(
                              selectedCategory === category ? undefined : category
                            );
                            handleFilterChange();
                          }}
                          className="text-black focus:ring-black"
                        />
                        <span className="text-sm text-foreground">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Min</label>
                      <input
                        type="number"
                        value={priceRange.min || ''}
                        onChange={(e) => {
                          setPriceRange({
                            ...priceRange,
                            min: e.target.value ? Number(e.target.value) : undefined,
                          });
                          handleFilterChange();
                        }}
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="$"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max</label>
                      <input
                        type="number"
                        value={priceRange.max || ''}
                        onChange={(e) => {
                          setPriceRange({
                            ...priceRange,
                            max: e.target.value ? Number(e.target.value) : undefined,
                          });
                          handleFilterChange();
                        }}
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        placeholder="$"
                      />
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground">Brand</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === brand}
                          onChange={() => {
                            setSelectedBrand(
                              selectedBrand === brand ? undefined : brand
                            );
                            handleFilterChange();
                          }}
                          className="text-black focus:ring-black"
                        />
                        <span className="text-sm text-foreground">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-border mt-4"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
