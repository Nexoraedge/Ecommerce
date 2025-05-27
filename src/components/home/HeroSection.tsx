'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  color: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: '/banners/banner-1.jpg',
    title: 'Summer Collection',
    subtitle: 'Up to 50% off on selected items',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=summer',
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 2,
    image: '/banners/banner-2.jpg',
    title: 'New Arrivals',
    subtitle: 'Check out the latest fashion trends',
    buttonText: 'Explore',
    buttonLink: '/products?category=new-arrivals',
    color: 'from-pink-600 to-orange-600',
  },
  {
    id: 3,
    image: '/banners/banner-3.jpg',
    title: 'Exclusive Deals',
    subtitle: 'Limited time offers on premium brands',
    buttonText: 'View Deals',
    buttonLink: '/products?category=deals',
    color: 'from-green-600 to-teal-600',
  },
];

const categories = [
  { name: 'Men', icon: '👔', link: '/categories/men-clothing' },
  { name: 'Women', icon: '👗', link: '/categories/women-clothing' },
  { name: 'Kids', icon: '🧸', link: '/categories/kids' },
  { name: 'Shoes', icon: '👟', link: '/categories/shoes' },
  { name: 'Accessories', icon: '👜', link: '/categories/accessories' },
  { name: 'Electronics', icon: '📱', link: '/categories/electronics' },
  { name: 'Home', icon: '🏠', link: '/categories/home' },
  { name: 'Beauty', icon: '💄', link: '/categories/beauty' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const nextSlide = useCallback(() => {
    setCurrent((current) => (current === carouselItems.length - 1 ? 0 : current + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((current) => (current === 0 ? carouselItems.length - 1 : current - 1));
  }, []);

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search page with query
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <section className="bg-background">
      {/* Search bar - Similar to Flipkart/Meesho */}
      <div className="bg-primary py-3 px-4 md:py-4 dark:bg-primary/90">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <form 
            onSubmit={handleSearch}
            className="relative flex-1 flex w-full max-w-3xl"
          >
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="w-full py-2 px-4 pr-10 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-primary-foreground hover:underline font-medium"
            >
              Login
            </Link>
            <Link 
              href="/cart" 
              className="bg-primary-foreground text-primary px-4 py-1.5 rounded-md font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Category shortcuts - Similar to Flipkart/Meesho */}
      <div className="bg-card border-b border-border py-4 px-4 dark:bg-card/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                href={category.link}
                className="flex flex-col items-center justify-center p-2 hover:text-primary transition-colors"
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main carousel */}
      <div className="relative overflow-hidden">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          {/* Carousel navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-background/80 dark:bg-background/40 p-2 rounded-full shadow-lg hover:bg-background transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-background/80 dark:bg-background/40 p-2 rounded-full shadow-lg hover:bg-background transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel slides */}
          <AnimatePresence mode="wait">
            {carouselItems.map((item, index) => (
              index === current && (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {/* Background image with gradient overlay */}
                  <div className="absolute inset-0 z-0">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-80 dark:opacity-90`} />
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-lg">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-3xl md:text-5xl font-bold text-white mb-3"
                        >
                          {item.title}
                        </motion.h2>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg text-white/90 mb-6"
                        >
                          {item.subtitle}
                        </motion.p>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link
                            href={item.buttonLink}
                            className="inline-flex items-center px-6 py-3 rounded-md bg-white text-primary font-medium shadow-lg hover:shadow-xl transition-all"
                          >
                            {item.buttonText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === current ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}n
          </div>
        </div>
      </div>

      {/* Special offers section */}
      <div className="bg-muted/50 dark:bg-muted/20 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                  <path d="M12 7v5l2.5 2.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Member Discounts</h3>
                <p className="text-sm text-muted-foreground">Save up to 20% on every purchase</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2Z" />
                  <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  <path d="M20 15h-8" />
                  <path d="M20 9h-8" />
                  <path d="M8 9h1" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">Multiple payment methods accepted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
