'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => void;
}

export default function ProductFilters({
  categories,
  brands,
  onFilterChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl z-50 lg:relative lg:top-auto lg:right-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:shadow-none"
            >
              <div className="p-4 border-b lg:border-none">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Category</h3>
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
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Min</label>
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
                      <label className="text-xs text-gray-500">Max</label>
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
                  <h3 className="text-sm font-medium mb-3">Brand</h3>
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
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
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
