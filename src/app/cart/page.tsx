'use client';

import { motion } from 'framer-motion';
import useCart from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, saveForLater, subtotal, tax, shipping, total, moveToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          {/* Main cart */}
          {items.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-4">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <motion.div layout className="bg-white rounded-lg shadow-sm divide-y">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </motion.div>
          )}

          {/* Saved for later */}
          {saveForLater.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Saved for Later</h2>
              <div className="bg-white rounded-lg shadow-sm divide-y">
                {saveForLater.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => moveToCart(item.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Move to Cart
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        {items.length > 0 && (
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-3 px-4 rounded-md bg-black text-white text-center font-medium hover:bg-gray-900 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
