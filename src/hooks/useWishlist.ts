'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/products';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const isInWishlist = get().items.some((item) => item.id === product.id);
        if (!isInWishlist) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlist;
