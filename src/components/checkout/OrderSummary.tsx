import { motion } from 'framer-motion';
import useCart, { Cartitem } from '@/hooks/useCart';
import Image from 'next/image';

export default function OrderSummary() {
  const { items, subtotal, tax, shipping, total } = useCart();

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {items.map((item: Cartitem) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 flex"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  {item.color && (
                    <p className="mt-1 text-sm text-gray-500">
                      Color: {item.color}
                    </p>
                  )}
                  {item.size && (
                    <p className="mt-1 text-sm text-gray-500">
                      Size: {item.size}
                    </p>
                  )}
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Shipping</p>
          <p>${shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>
        {shipping > 0 && (
          <p className="text-sm text-gray-500">
            Free shipping on orders over $100
          </p>
        )}
        <div className="flex justify-between text-base font-medium text-gray-900 border-t border-gray-200 pt-4">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
