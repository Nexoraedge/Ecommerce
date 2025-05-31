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
    image: '/banners/summer_sale.png',
    title: 'Summer Collection',
    subtitle: 'Up to 50% off on selected items',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=summer',
    color: 'from-sky-400/40 to-transparent',
  },
  {
    id: 2,
    image: '/banners/new_arrivals.png',
    title: 'New Arrivals',
    subtitle: 'Check out the latest fashion trends',
    buttonText: 'Explore',
    buttonLink: '/products?category=new-arrivals',
    color: 'from-amber-400/40 to-transparent',
  },
  {
    id: 3,
    image: '/banners/trending_fashion.png',
    title: 'Exclusive Deals',
    subtitle: 'Limited time offers on premium brands',
    buttonText: 'View Deals',
    buttonLink: '/products?category=deals',
    color: 'from-zinc-800/50 to-transparent',
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

  return (
    <section className="bg-background">

      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-xl shadow-xl mx-4 my-4">
        <div className="relative h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden">
          {/* Carousel navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-background/30 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background/50 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white dark:text-black drop-shadow-md" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-background/30 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background/50 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white dark:text-black drop-shadow-md" />
          </button>

          {/* Carousel slides */}
          <AnimatePresence mode="wait">
            {carouselItems.map(({id, image, title, subtitle, buttonText, buttonLink, color}, index) => (
              index === current && (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {/* Background image with gradient overlay */}
                  <div className="absolute inset-0 z-0">
                    <div className={`absolute inset-0 bg-gradient-to-r ${color}`} />
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Content
                  <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
                      <div className="max-w-lg">
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg"
                        >
                          {title}
                        </motion.h2>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-xl text-white mb-6 drop-shadow-md max-w-md"
                        >
                          {subtitle}
                        </motion.p>
                      </div>
                    </div>
                  </div> */}
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Floating Explore button */}
          <motion.div 
            className="absolute bottom-10 left-0 right-0 z-20 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/products"
              className="px-8 py-3 rounded-full bg-white text-zinc-800 font-medium shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
            >
              <span>Explore</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
          
          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-3">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all transform ${index === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Special offers section */}
      <div className="bg-muted/50 dark:bg-muted/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Shop With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
