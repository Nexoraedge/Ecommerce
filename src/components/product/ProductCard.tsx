'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Check, Star } from 'lucide-react';
import useCart, { Cartitem } from '@/hooks/useCart';
import Link from 'next/link';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      maxQuantity: product.maxQuantity,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-card dark:bg-card/95 rounded-lg border border-border overflow-hidden transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-primary/5"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted/50 dark:bg-muted/20">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Quick actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  className="p-3 bg-background dark:bg-card rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ShoppingCart className="h-5 text-white w-5" />
                </motion.button>
                {/* Wishlist Button */}
                <div className="p-0">
                  
                  {require('@/components/wishlist/WishlistButton').default && (
                    <>
                      {(() => {
                        const WishlistButton = require('@/components/wishlist/WishlistButton').default;
                        return <WishlistButton product={product} size="md" variant="circle" />;
                      })()}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{product.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center text-yellow-500 dark:text-yellow-400 space-x-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm text-gray-500">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="mt-4 gap-x-1.5 w-full py-2 px-4 bg-primary hover:opacity-90 text-primary-foreground rounded-md font-medium transition-opacity flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="adding"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-green-600"
              >
                <Check className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.span
                key="add"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingCart className="w-4 h-4 mr-2" />
        </motion.button>
      </div>
    </motion.div>
  );
}
