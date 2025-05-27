'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, filterProducts } from '@/lib/products';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Search, SlidersHorizontal, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Get unique categories and brands
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Handle scroll events for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  // Handle search query from URL params
  useEffect(() => {
    setIsLoading(true);
    
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    
    // Simulate network delay for better UX demonstration
    const timer = setTimeout(() => {
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
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }) => {
    setIsLoading(true);
    
    // Simulate network delay for better UX demonstration
    setTimeout(() => {
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
      
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 relative">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto sm:mx-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search') as string;
              if (query.trim()) {
                window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchQuery || ''}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-border pb-6">
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
        
        {/* Desktop filters */}
        <div className="hidden sm:block">
          <ProductFilters
            categories={categories}
            brands={brands}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
      
      {/* Mobile filter button (fixed at bottom) */}
      <div className="fixed bottom-4 right-4 sm:hidden z-30">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Show filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* Mobile filters */}
      <div className="sm:hidden">
        {showMobileFilters && (
          <ProductFilters
            categories={categories}
            brands={brands}
            onFilterChange={handleFilterChange}
            isMobile={true}
            onClose={() => setShowMobileFilters(false)}
          />
        )}
      </div>
      
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity z-30"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
