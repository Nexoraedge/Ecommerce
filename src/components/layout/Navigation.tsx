'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

const getNavigationItems = (isAuthenticated: boolean) => [
  { name: 'Home', href: '/' },
  { name: 'Men', href: '/category/men' },
  { name: 'Women', href: '/category/women' },
  { name: 'Kids', href: '/category/kids' },
  { name: 'Sale', href: '/sale' },
  ...(isAuthenticated
    ? [
        { name: 'My Orders', href: '/orders' },
        { name: 'Wishlist', href: '/wishlist' },
      ]
    : []),
];

export default function Navigation({ mobile, onClose }: NavigationProps) {
  const { user } = useAuth();
  const containerClasses = mobile
    ? 'flex flex-col py-4 space-y-2'
    : 'flex items-center space-x-8';

  const linkClasses = mobile
    ? 'block px-4 py-2 text-base hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative';

  const linkMotion = {
    whileHover: mobile ? {} : { y: -2 },
    whileTap: { scale: 0.95 },
  };

  const underlineMotion = {
    initial: { width: 0 },
    whileHover: { width: '100%' },
  };

  const navigationItems = getNavigationItems(!!user);
  
  return (
    <nav className={containerClasses}>
      {navigationItems.map((item) => (
        <motion.div key={item.name} {...linkMotion}>
          <Link
            href={item.href}
            className={linkClasses}
            onClick={onClose}
          >
            {item.name}
            {!mobile && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                initial="initial"
                whileHover="whileHover"
                variants={underlineMotion}
              />
            )}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
