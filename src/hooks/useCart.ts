import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

export type Cartitem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  maxQuantity: number;
};

type CartStore = {
  items: Cartitem[];
  isOpen: boolean;
  addItem: (item: Cartitem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  promoCode: string | null;
  setPromoCode: (code: string | null) => void;
  saveForLater: Cartitem[];
  moveToSaveForLater: (itemId: string) => void;
  moveToCart: (itemId: string) => void;
};

const TAX_RATE = 0.08; // 8% tax rate
const BASE_SHIPPING = 10; // Base shipping cost

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      saveForLater: [],
      promoCode: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + item.quantity,
              existingItem.maxQuantity
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      get tax() {
        return get().subtotal * TAX_RATE;
      },

      get shipping() {
        const subtotal = get().subtotal;
        return subtotal > 100 ? 0 : BASE_SHIPPING; // Free shipping over $100
      },

      get total() {
        const subtotal = get().subtotal;
        const tax = get().tax;
        const shipping = get().shipping;
        const discount = get().promoCode === 'WELCOME10' ? subtotal * 0.1 : 0;
        return subtotal + tax + shipping - discount;
      },

      setPromoCode: (code) => set({ promoCode: code }),

      moveToSaveForLater: (itemId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.id !== itemId),
            saveForLater: [...state.saveForLater, item],
          };
        }),

      moveToCart: (itemId) =>
        set((state) => {
          const item = state.saveForLater.find((i) => i.id === itemId);
          if (!item) return state;
          return {
            saveForLater: state.saveForLater.filter((i) => i.id !== itemId),
            items: [...state.items, item],
          };
        }),
    }),
    {
      name: 'shopping-cart',
    }
  )
);

export default useCart;
