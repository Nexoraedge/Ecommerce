import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Trash2 } from 'lucide-react';
import useCart, { Cartitem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, moveToSaveForLater } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-4 p-4 border-b border-gray-200"
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <div className="mt-1 text-sm text-gray-500">
          {item.size && <span className="mr-2">Size: {item.size}</span>}
          {item.color && <span>Color: {item.color}</span>}
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-1 rounded-md hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-1 rounded-md hover:bg-gray-100"
            disabled={item.quantity >= item.maxQuantity}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <span className="font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => moveToSaveForLater(item.id)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            title="Save for later"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
