'use client';

import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Men\'s Collection',
    description: 'Elevate your style with our premium menswear',
    image: '/categories/men/main.png',
    href: '/category/men',
  },
  {
    name: 'Women\'s Collection',
    description: 'Discover the latest trends in women\'s fashion',
    image: '/categories/women/main.png',
    href: '/category/women',
  },
  {
    name: 'Kids Collection',
    description: 'Adorable styles for your little ones',
    image: '/categories/kids/main.png',
    href: '/category/kids',
  },
  {
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    image: '/categories/men/accessories/main.png',
    href: '/category/accessories',
  },
];

export default function CategoriesShowcase() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find what you're looking for in our curated collections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href={category.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-4">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                
                {/* Image */}
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
