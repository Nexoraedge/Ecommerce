'use client';

import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import useCart from '@/hooks/useCart';

export default function CartButton() {
  const { items, toggleCart } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-foreground/60 transition-colors hover:text-foreground/80"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white"
        >
          {itemCount}
        </motion.div>
      )}
    </button>
  );
}
