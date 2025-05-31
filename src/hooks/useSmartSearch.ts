'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, products } from '@/lib/products';

// Fuzzy search function to find products that match the query
const fuzzySearch = (query: string, products: Product[]): Product[] => {
  if (!query) return [];
  
  // Convert query to lowercase for case-insensitive matching
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return [];
  
  return products.filter(product => {
    // Search in product name
    const nameMatch = searchTerms.some(term => 
      product.name.toLowerCase().includes(term)
    );
    
    // Search in product description
    const descMatch = searchTerms.some(term => 
      product.description.toLowerCase().includes(term)
    );
    
    // Search in product category
    const categoryMatch = searchTerms.some(term => 
      product.category.toLowerCase().includes(term)
    );
    
    // Search in product brand
    const brandMatch = searchTerms.some(term => 
      product.brand.toLowerCase().includes(term)
    );
    
    // Check for common misspellings and synonyms
    const smartMatch = checkSmartMatches(searchTerms, product);
    
    return nameMatch || descMatch || categoryMatch || brandMatch || smartMatch;
  });
};

// Function to check for common misspellings and synonyms
const checkSmartMatches = (searchTerms: string[], product: Product): boolean => {
  // Common misspellings and their corrections
  const misspellings: Record<string, string[]> = {
    'shoe': ['shos', 'sho', 'shooe', 'shoess', 'shose'],
    'shirt': ['shrt', 'shit', 'shiirt', 'shrit'],
    'pants': ['pant', 'pnts', 'panst'],
    'jacket': ['jackt', 'jaket', 'jackket'],
    'dress': ['dres', 'drss', 'dresse'],
    'sneaker': ['sneakr', 'snekers', 'sneker'],
    'watch': ['wach', 'watche', 'wtch'],
    'jewelry': ['jewelery', 'jewlry', 'jewellery'],
    'bag': ['bagg', 'beg'],
  };
  
  // Synonyms for common product terms
  const synonyms: Record<string, string[]> = {
    'shoe': ['footwear', 'sneaker', 'boot', 'sandal'],
    'shirt': ['tee', 't-shirt', 'top', 'blouse'],
    'pants': ['trousers', 'jeans', 'slacks', 'bottoms'],
    'jacket': ['coat', 'blazer', 'outerwear'],
    'dress': ['gown', 'frock'],
    'bag': ['purse', 'handbag', 'backpack', 'tote'],
    'jewelry': ['accessory', 'necklace', 'bracelet', 'ring'],
    'hat': ['cap', 'beanie', 'headwear'],
  };
  
  // Check if any search term is a misspelling of a product attribute
  for (const term of searchTerms) {
    // Check misspellings
    for (const [correct, misspelled] of Object.entries(misspellings)) {
      if (misspelled.includes(term)) {
        // If it's a misspelling, check if the correct term matches the product
        if (
          product.name.toLowerCase().includes(correct) ||
          product.description.toLowerCase().includes(correct) ||
          product.category.toLowerCase().includes(correct)
        ) {
          return true;
        }
      }
    }
    
    // Check synonyms
    for (const [word, synonymList] of Object.entries(synonyms)) {
      if (term === word || synonymList.includes(term)) {
        // If it's a synonym, check if the main word or other synonyms match the product
        const termsToCheck = [word, ...synonymList];
        for (const checkTerm of termsToCheck) {
          if (
            product.name.toLowerCase().includes(checkTerm) ||
            product.description.toLowerCase().includes(checkTerm) ||
            product.category.toLowerCase().includes(checkTerm)
          ) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
};

export default function useSmartSearch() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    
    // Simulate a slight delay to feel more like an API call
    setTimeout(() => {
      const searchResults = fuzzySearch(searchQuery, products);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);
  }, []);
  
  return {
    query,
    setQuery,
    results,
    isSearching,
    search
  };
}
