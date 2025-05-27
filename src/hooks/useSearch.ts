'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      // Reset query after search
      setQuery('');
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
    clearSearch
  };
}

export default useSearch;
