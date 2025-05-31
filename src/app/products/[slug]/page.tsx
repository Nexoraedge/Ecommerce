'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, Heart, ArrowLeft, ArrowRight, Share2, ShoppingBag } from 'lucide-react';
import { getProduct, getRelatedProducts } from '@/lib/products';
import useCart from '@/hooks/useCart';
import ProductGrid from '@/components/product/ProductGrid';
import ProductReviews from '@/components/product/ProductReviews';
import RelatedProducts from '@/components/product/RelatedProducts';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const product = getProduct(params.slug as string);
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>();
  const [selectedColor, setSelectedColor] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Save to recently viewed
  useEffect(() => {
    if (product) {
      // Get existing recently viewed products from localStorage
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Add current product to the beginning if not already there
      if (!recentlyViewed.includes(product.id)) {
        const updatedRecentlyViewed = [product.id, ...recentlyViewed].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground">
        <ShoppingBag className="w-16 h-16 mb-4 text-muted" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          Browse Products
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.category, product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
      maxQuantity: product.maxQuantity,
    });
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-12">
      {/* Top navigation bar with back button */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-foreground hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
              {showShareOptions && (
                <div className="absolute right-0 top-full mt-2 bg-card shadow-lg rounded-lg p-3 w-48 border border-border">
                  <div className="text-sm font-medium mb-2">Share via</div>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="flex flex-col items-center justify-center p-2 hover:bg-muted rounded-md">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mb-1">
                        <span className="text-white text-xs">a</span>
                      </div>
                      <span className="text-xs">Apple</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 hover:bg-muted rounded-md">
                      <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center mb-1">
                        <span className="text-white text-xs">t</span>
                      </div>
                      <span className="text-xs">Twitter</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 hover:bg-muted rounded-md">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1">
                        <span className="text-white text-xs">w</span>
                      </div>
                      <span className="text-xs">WhatsApp</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 hover:bg-muted rounded-md">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-1">
                        <span className="text-white text-xs">g</span>
                      </div>
                      <span className="text-xs">Google</span>
                    </button>
                  </div>
                </div>
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Add to wishlist">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${product.category}`} className="hover:text-primary">
            {product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-card">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${activeImage === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0 lg:pl-8">
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <div className="mt-1 flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>
            
            <div className="mt-4 flex items-end">
              <p className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</p>
              <span className="ml-2 text-sm text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">In Stock</span>
            </div>
            
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground">Description</h3>
              <div className="mt-2 text-sm text-muted-foreground space-y-3">
                <p>{product.description}</p>
                <p>Brand: <span className="font-medium text-foreground">{product.brand}</span></p>
              </div>
            </div>

            {/* Colors */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Color</h3>
                {selectedColor && <span className="text-xs text-muted-foreground">Selected: {selectedColor}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative h-10 w-10 overflow-hidden rounded-full ${selectedColor === color
                      ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background'
                      : 'ring-1 ring-border hover:ring-primary/50'}`}
                    aria-label={`Select ${color} color`}
                  >
                    <span 
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Size</h3>
                {selectedSize && <span className="text-xs text-muted-foreground">Selected: {selectedSize}</span>}
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-center rounded-md py-2 text-sm font-medium ${selectedSize === size
                      ? 'bg-primary  text-primary-foreground'
                      : 'bg-card text-foreground border border-border hover:border-primary/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground">Quantity</h3>
              <div className="mt-3 flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + 1))}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground">
                  (Max: {product.maxQuantity})
                </span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 flex items-center justify-center px-8 py-3 rounded-md text-base font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </motion.button>
              <button 
                className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors font-medium"
              >
                Buy Now
              </button>
            </div>

            {/* Product specifications */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground">Specifications</h3>
              <div className="mt-4 space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery options */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground">Delivery Options</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-start">
                  <div className="p-2 bg-muted rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="16" height="13" x="4" y="5" rx="2" />
                      <path d="M16 2v3" />
                      <path d="M8 2v3" />
                      <path d="M4 10h16" />
                      <path d="M10 14h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-muted rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M4 10h12" />
                      <path d="M4 14h9" />
                      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 8 8 2 0 3.8-.8 5.2-2" />
                      <path d="M22 6h-3V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30 days return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <ProductReviews productId={product.id} initialReviews={[]} />
        
        {/* Similar products section */}
        <div className="mt-16 border-t border-border pt-8">
          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
            title="Similar Products" 
            viewAllLink={`/categories/${product.category}`} 
          />
        </div>
      </div>
    </div>
  );
}
