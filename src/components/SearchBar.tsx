'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useSearch from '@/hooks/useSearch';

export default function SearchBar() {
  const { query, setQuery, handleSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search submission with our custom hook
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(e);
    setIsOpen(false);
  };

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Toggle search bar
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search button for mobile/closed state */}
      {!isOpen && (
        <button
          onClick={toggleSearch}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {/* Expanded search bar */}
      {isOpen && (
        <div className="absolute right-0 top-0 z-10 w-full sm:w-80 animate-in fade-in slide-in-from-top-5 duration-300">
          <form onSubmit={onSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-10 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-1">
              <button
                type="button"
                onClick={toggleSearch}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
