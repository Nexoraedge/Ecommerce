'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, filterProducts } from '@/lib/products';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Get unique categories and brands
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Handle search query from URL params
  useEffect(() => {
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
      
      // Filter products based on search query
      const searchResults = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesDescription = product.description?.toLowerCase().includes(query.toLowerCase());
        const matchesBrand = product.brand.toLowerCase().includes(query.toLowerCase());
        return matchesName || matchesDescription || matchesBrand;
      });
      
      setFilteredProducts(searchResults);
    } else if (category) {
      // Filter by category if present
      setFilteredProducts(filterProducts({ category }));
    } else {
      setSearchQuery(null);
      setIsSearching(false);
      setFilteredProducts(products);
    }
  }, [searchParams]);

  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => {
    // If we're searching, apply filters to search results
    if (searchQuery) {
      const baseProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDescription = product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = product.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesName || matchesDescription || matchesBrand;
      });
      
      setFilteredProducts(filterProducts(filters, baseProducts));
    } else {
      setFilteredProducts(filterProducts(filters));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-baseline justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {searchQuery ? 'Search Results' : 'Products'}
          </h1>
          {searchQuery && (
            <div className="mt-1 flex items-center text-muted-foreground">
              <Search className="h-4 w-4 mr-1" />
              <span className="text-sm">Results for "{searchQuery}"</span>
              <span className="ml-1 text-sm">({filteredProducts.length} items)</span>
            </div>
          )}
        </div>
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
