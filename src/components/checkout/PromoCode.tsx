import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCart from '@/hooks/useCart';

export default function PromoCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { setPromoCode } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsApplying(true);

    try {
      // In a real application, you would validate the promo code with your backend
      if (code.toUpperCase() === 'WELCOME10') {
        setPromoCode(code);
        setCode('');
        setError('');
      } else {
        setError('Invalid promo code');
      }
    } catch (err) {
      setError('Failed to apply promo code');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-grow">
          <label htmlFor="promo-code" className="sr-only">
            Promo code
          </label>
          <input
            type="text"
            id="promo-code"
            name="promo-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter promo code"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isApplying || !code}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </motion.button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
