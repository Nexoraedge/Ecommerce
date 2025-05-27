'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, X, Eye, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  rating?: number;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

interface SimilarProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Tee',
    price: 29.99,
    image: '/products/white-tee.jpg',
    category: 'Men',
    rating: 4.5,
    description: 'A comfortable and versatile white t-shirt made from 100% organic cotton.',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Summer Floral Dress',
    price: 89.99,
    salePrice: 69.99,
    image: '/products/floral-dress.jpg',
    category: 'Women',
    rating: 4.8,
    description: 'A beautiful floral dress perfect for summer days and special occasions.',
    colors: ['Blue', 'Pink', 'Yellow'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '3',
    name: 'Denim Jacket',
    price: 129.99,
    image: '/products/denim-jacket.jpg',
    category: 'Unisex',
    rating: 4.3,
    description: 'A classic denim jacket that never goes out of style. Perfect for layering.',
    colors: ['Blue', 'Black', 'Light Wash'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '4',
    name: 'Athletic Sneakers',
    price: 119.99,
    salePrice: 99.99,
    image: '/products/sneakers.jpg',
    category: 'Shoes',
    rating: 4.7,
    description: 'Comfortable and stylish sneakers for your active lifestyle.',
    colors: ['White', 'Black', 'Gray', 'Red'],
    sizes: ['7', '8', '9', '10', '11', '12']
  },
];

// Similar products suggestions
const similarProductsMap: Record<string, SimilarProduct[]> = {
  '1': [
    { id: '101', name: 'Premium Cotton Tee', price: 34.99, image: '/products/premium-tee.jpg' },
    { id: '102', name: 'V-Neck T-Shirt', price: 24.99, image: '/products/vneck-tee.jpg' },
    { id: '103', name: 'Long Sleeve Tee', price: 39.99, image: '/products/longsleeve-tee.jpg' }
  ],
  '2': [
    { id: '201', name: 'Maxi Dress', price: 79.99, image: '/products/maxi-dress.jpg' },
    { id: '202', name: 'Casual Sundress', price: 59.99, image: '/products/sundress.jpg' },
    { id: '203', name: 'Evening Gown', price: 149.99, image: '/products/evening-gown.jpg' }
  ],
  '3': [
    { id: '301', name: 'Leather Jacket', price: 199.99, image: '/products/leather-jacket.jpg' },
    { id: '302', name: 'Bomber Jacket', price: 89.99, image: '/products/bomber-jacket.jpg' },
    { id: '303', name: 'Windbreaker', price: 69.99, image: '/products/windbreaker.jpg' }
  ],
  '4': [
    { id: '401', name: 'Running Shoes', price: 129.99, image: '/products/running-shoes.jpg' },
    { id: '402', name: 'Casual Loafers', price: 79.99, image: '/products/loafers.jpg' },
    { id: '403', name: 'Hiking Boots', price: 149.99, image: '/products/hiking-boots.jpg' }
  ]
};

export default function FeaturedProducts() {
  const { user } = useAuth();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openProductQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setQuantity(1);
    setIsModalOpen(true);
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Track viewed products for personalized suggestions
    if (!viewedProducts.includes(product.id)) {
      const updatedViewedProducts = [product.id, ...viewedProducts].slice(0, 10);
      setViewedProducts(updatedViewedProducts);
      
      // Update recently viewed products list
      const updatedRecentlyViewed = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 4);
      setRecentlyViewed(updatedRecentlyViewed);
    }
  };

  const closeProductQuickView = () => {
    setIsModalOpen(false);
    
    // Allow body scrolling again
    document.body.style.overflow = 'auto';
    
    // Delay the state reset to allow the animation to complete
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
    }, 300);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <section className="py-12 bg-muted/30 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Recently viewed products - Only show if there are items */}
        {recentlyViewed.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Recently Viewed</h3>
              <Link 
                href="/products/history" 
                className="text-sm text-primary hover:underline flex items-center"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((product) => (
                <div 
                  key={`recent-${product.id}`} 
                  className="bg-card dark:bg-card/90 rounded-lg overflow-hidden border border-border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openProductQuickView(product)}
                >
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-primary text-sm font-semibold mt-1">
                      ${product.salePrice || product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-1">
              Discover our hand-picked selection of trending items
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/products" 
              className="hidden md:flex items-center text-primary hover:underline"
            >
              View all products <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dummyProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className="group relative bg-card dark:bg-card/90 rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* Sale Badge */}
              {product.salePrice && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SALE
                </div>
              )}
              
              {/* Product Image */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => openProductQuickView(product)}
              >
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white rounded-full shadow-lg"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductQuickView(product);
                    }}
                    aria-label="Quick view"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white rounded-full shadow-lg"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                    {product.category}
                  </p>
                  {product.rating && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium ml-1 text-muted-foreground">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium text-sm text-foreground mb-1.5 line-clamp-2 hover:text-primary cursor-pointer h-10"
                    onClick={() => openProductQuickView(product)}>
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-base font-bold text-foreground">
                        ${product.salePrice}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.price}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-bold text-foreground">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto max-h-screen"
              onClick={closeProductQuickView}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-card dark:bg-card/95 max-w-5xl w-full rounded-xl shadow-xl border border-border max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Back button at the top */}
                <div className="sticky top-0 z-20 bg-card dark:bg-card/95 p-4 border-b border-border flex items-center justify-between">
                  <button
                    onClick={closeProductQuickView}
                    className="flex items-center text-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-medium">Back</span>
                  </button>
                  <button
                    onClick={closeProductQuickView}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="md:w-1/2 relative">
                    <div className="aspect-square">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{selectedProduct.name}</h3>
                        <p className="text-primary font-medium mb-2">{selectedProduct.category}</p>
                      </div>
                    </div>
                    
                    {selectedProduct.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {renderStars(selectedProduct.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">{selectedProduct.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      {selectedProduct.salePrice ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-foreground">${selectedProduct.salePrice}</span>
                          <span className="text-lg text-muted-foreground line-through">${selectedProduct.price}</span>
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            {Math.round(((selectedProduct.price - selectedProduct.salePrice) / selectedProduct.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-foreground">${selectedProduct.price}</span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-6">{selectedProduct.description}</p>
                    
                    {/* Color Selection */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Color</h4>
                        <div className="flex space-x-2">
                          {selectedProduct.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'}`}
                              style={{ backgroundColor: color.toLowerCase() }}
                              aria-label={`Select ${color} color`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Size Selection */}
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">Size</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1 border rounded-md text-sm ${selectedSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Quantity</h4>
                      <div className="flex items-center">
                        <button 
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="p-2 border border-border rounded-l-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <div className="px-4 py-2 border-t border-b border-border text-center w-12">
                          {quantity}
                        </div>
                        <button 
                          onClick={incrementQuantity}
                          disabled={quantity >= 10}
                          className="p-2 border border-border rounded-r-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-auto">
                      <button 
                        onClick={() => {
                          if (!selectedSize || !selectedColor) {
                            alert('Please select a size and color');
                            return;
                          }
                          // Add to cart logic here
                          alert('Item added to cart');
                        }}
                        disabled={!selectedSize || !selectedColor}
                        className="flex-1 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => {
                          if (!selectedSize || !selectedColor) {
                            alert('Please select a size and color');
                            return;
                          }
                          // Buy now logic
                          alert('Proceeding to checkout');
                        }}
                        disabled={!selectedSize || !selectedColor}
                        className="flex-1 bg-orange-500 dark:bg-orange-600 text-white py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy Now
                      </button>
                    </div>
                    
                    {/* Delivery info */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-start mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium">Free delivery</p>
                          <p className="text-xs text-muted-foreground">On orders over $50</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2 mt-0.5">
                          <path d="M20 7h-7.5a2.5 2.5 0 0 0-5 0H.5" />
                          <path d="M20 7v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7" />
                          <path d="M9 14V9" />
                          <path d="M15 14V9" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium">Easy returns</p>
                          <p className="text-xs text-muted-foreground">30 day return policy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Similar Products */}
                {similarProductsMap[selectedProduct.id] && (
                  <div className="p-6 border-t border-border bg-muted/30 dark:bg-muted/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">You might also like</h4>
                      <Link 
                        href="/products" 
                        className="text-sm text-primary font-medium hover:underline flex items-center"
                      >
                        View more <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                    <div className="overflow-hidden">
                      <div className="-mx-4 px-4 pb-4 overflow-x-auto hide-scrollbar">
                        <div className="flex space-x-4 min-w-max">
                          {similarProductsMap[selectedProduct.id].map((product) => (
                            <div 
                              key={product.id} 
                              className="group cursor-pointer bg-card dark:bg-card/80 rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeProductQuickView();
                                // Use setTimeout to allow the modal to close before opening a new one
                                setTimeout(() => {
                                  const productToView = dummyProducts.find(p => p.id === product.id);
                                  if (productToView) {
                                    openProductQuickView(productToView);
                                  }
                                }, 300);
                              }}
                            >
                              <div className="aspect-square overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <h5 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h5>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-sm font-bold text-foreground">${product.price}</p>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ShoppingCart className="h-4 w-4 text-primary" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* View all products button (mobile only) */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-md hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
          >
            View all products <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {/* Trending categories section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/categories/men-clothing" className="group relative overflow-hidden rounded-lg aspect-[3/2]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img src="/categories/men.jpg" alt="Men's Fashion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg">Men's Fashion</h3>
                <p className="text-white/80 text-sm">Shop Now</p>
              </div>
            </Link>
            <Link href="/categories/women-clothing" className="group relative overflow-hidden rounded-lg aspect-[3/2]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img src="/categories/women.jpg" alt="Women's Fashion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg">Women's Fashion</h3>
                <p className="text-white/80 text-sm">Shop Now</p>
              </div>
            </Link>
            <Link href="/categories/electronics" className="group relative overflow-hidden rounded-lg aspect-[3/2]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img src="/categories/electronics.jpg" alt="Electronics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg">Electronics</h3>
                <p className="text-white/80 text-sm">Shop Now</p>
              </div>
            </Link>
            <Link href="/categories/home" className="group relative overflow-hidden rounded-lg aspect-[3/2]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img src="/categories/home.jpg" alt="Home & Living" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg">Home & Living</h3>
                <p className="text-white/80 text-sm">Shop Now</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
