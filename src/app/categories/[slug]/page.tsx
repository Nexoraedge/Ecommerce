'use client';

import { useParams } from 'next/navigation';
import { getCategoryBySlug, getSubcategories } from '@/lib/categories';
import { products } from '@/lib/products';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CategoryPage() {
  const params = useParams();
  const category = getCategoryBySlug(params.slug as string);
  const subcategories = category ? getSubcategories(category.id) : [];
  const categoryProducts = products.filter(
    (product) => product.category === category?.id || subcategories.some(sub => product.category === sub.id)
  );

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold text-white">{category.name}</h1>
          <p className="mt-2 text-lg text-white/90">{category.description}</p>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse {category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/categories/${subcategory.slug}`}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">
                      {subcategory.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {category.name} Products ({categoryProducts.length})
        </h2>
        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  );
}
