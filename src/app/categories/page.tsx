'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedCategories } from '@/lib/categories';

export default function CategoriesPage() {
  const categories = getFeaturedCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop by Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[16/9] overflow-hidden rounded-lg"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-50" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                <p className="mt-2 text-sm text-white/90">{category.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
