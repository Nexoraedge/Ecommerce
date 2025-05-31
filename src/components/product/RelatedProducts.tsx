'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/lib/products';

interface RelatedProductsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
  viewAllLink?: string;
}

export default function RelatedProducts({
  currentProductId,
  category,
  title = "You might also like",
  viewAllLink = "/products"
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Import products dynamically to avoid circular dependencies
        const { products, getRelatedProducts } = await import('@/lib/products');
        
        let relatedItems: Product[] = [];
        
        if (category) {
          relatedItems = products.filter(p => p.category === category);
        } else if (currentProductId) {
          relatedItems = getRelatedProducts(category || '', currentProductId);
        } else {
          // Fallback to random products
          relatedItems = [...products].sort(() => 0.5 - Math.random());
        }
        
        // Filter out current product if provided
        if (currentProductId) {
          relatedItems = relatedItems.filter(p => p.id !== currentProductId);
        }
        
        // Limit to 6 products
        setProducts(relatedItems.slice(0, 6));
        
        // Get recently viewed from localStorage
        const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (recentlyViewedIds.length > 0) {
          const recentItems = products.filter(p => recentlyViewedIds.includes(p.id));
          setRecentlyViewed(recentItems.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [category, currentProductId]);

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-6 bg-muted/50 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-muted/50 rounded-lg"></div>
              <div className="h-4 bg-muted/50 rounded w-3/4"></div>
              <div className="h-4 bg-muted/50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0 && recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {/* Related Products */}
      {products.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <Link 
              href={viewAllLink}
              className="text-sm text-primary hover:underline flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-hidden">
            <div className="-mx-4 px-4 pb-4 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 min-w-max">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="w-[200px] flex-shrink-0 group"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square rounded-lg overflow-hidden border border-border bg-card mb-2">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-primary font-semibold mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Recently Viewed</h3>
            <Link 
              href="/products/history"
              className="text-sm text-primary hover:underline flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-hidden">
            <div className="-mx-4 px-4 pb-4 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-4 min-w-max">
                {recentlyViewed.map((product) => (
                  <div 
                    key={product.id} 
                    className="w-[200px] flex-shrink-0 group"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square rounded-lg overflow-hidden border border-border bg-card mb-2">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-primary font-semibold mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
