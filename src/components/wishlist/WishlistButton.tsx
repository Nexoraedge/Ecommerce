'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import useWishlist from '@/hooks/useWishlist';
import { Product } from '@/lib/products';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'circle';
}

export default function WishlistButton({
  product,
  size = 'md',
  variant = 'default',
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleWishlist}
      className={`
        ${variant === 'circle' ? 'rounded-full' : 'rounded-md'}
        ${sizeClasses[size]}
        ${
          inWishlist
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white text-gray-900 hover:bg-gray-100'
        }
        shadow-lg transition-colors
      `}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={inWishlist ? 'filled' : 'outline'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={`${iconSizes[size]} ${inWishlist ? 'fill-current' : ''}`}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
