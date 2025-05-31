'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSmartSearch from './useSmartSearch';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { search: smartSearch, results: smartResults } = useSmartSearch();
  
  // Initialize query from URL if present
  useEffect(() => {
    const searchQuery = searchParams?.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
      smartSearch(searchQuery);
    }
  }, [searchParams, smartSearch]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (query.trim()) {
      setIsSearching(true);
      // Perform smart search first
      smartSearch(query.trim());
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return {
    query,
    setQuery,
    isSearching,
    handleSearch,
    clearSearch,
    smartResults
  };
}

export default useSearch;
