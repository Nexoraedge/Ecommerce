'use client';

import { useState } from 'react';
import { products, filterProducts } from '@/lib/products';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Get unique categories and brands
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => {
    setFilteredProducts(filterProducts(filters));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
        <ProductFilters
          categories={categories}
          brands={brands}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="mt-8">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
