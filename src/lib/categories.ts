export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  parentId?: string;
  featured?: boolean;
};

export const categories: Category[] = [
  {
    id: 'men',
    name: 'Men',
    description: 'Shop men\'s clothing, shoes, and accessories',
    image: '/categories/men/main.png',
    slug: 'men',
    featured: true,
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Discover women\'s fashion and accessories',
    image: '/categories/women/main.png',
    slug: 'women',
    featured: true,
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Explore children\'s clothing and accessories',
    image: '/categories/kids/main.png',
    slug: 'kids',
    featured: true,
  },
  // Men's subcategories
  {
    id: 'men-clothing',
    name: 'Clothing',
    description: 'Men\'s clothing collection',
    image: '/categories/men/clothing/main.png',
    slug: 'men/clothing',
    parentId: 'men',
  },
  {
    id: 'men-shoes',
    name: 'Shoes',
    description: 'Men\'s footwear collection',
    image: '/categories/men/shoes/main.png',
    slug: 'men/shoes',
    parentId: 'men',
  },
  {
    id: 'men-accessories',
    name: 'Accessories',
    description: 'Men\'s accessories collection',
    image: '/categories/men/accessories/main.png',
    slug: 'men/accessories',
    parentId: 'men',
  },
  {
    id: 'men-accessories',
    name: 'Accessories',
    description: 'Men\'s accessories collection',
    image: '/categories/men/accessories/main.png',
    slug: 'men/accessories',
    parentId: 'accessories',
  },
  // Women's subcategories
  {
    id: 'women-clothing',
    name: 'Clothing',
    description: 'Women\'s clothing collection',
    image: '/categories/women/clothing/main.png',
    slug: 'women/clothing',
    parentId: 'women',
  },
  {
    id: 'women-shoes',
    name: 'Shoes',
    description: 'Women\'s footwear collection',
    image: '/categories/women/shoes/main.png',
    slug: 'women/shoes',
    parentId: 'women',
  },
  {
    id: 'women-accessories',
    name: 'Accessories',
    description: 'Women\'s accessories collection',
    image: '/categories/women/accessories/main.png',
    slug: 'women/accessories',
    parentId: 'women',
  },
  {
    id: 'women-accessories',
    name: 'Accessories',
    description: 'Women\'s accessories collection',
    image: '/categories/women/accessories/main.png',
    slug: 'women/accessories',
    parentId: 'accessories',
  },
  // Kids' subcategories
  {
    id: 'kids-boys',
    name: 'Boys',
    description: 'Boys\' clothing and accessories',
    image: '/categories/kids/boys/main.png',
    slug: 'kids/boys',
    parentId: 'kids',
  },
  {
    id: 'kids-girls',
    name: 'Girls',
    description: 'Girls\' clothing and accessories',
    image: '/categories/kids/girls/main.png',
    slug: 'kids/girls',
    parentId: 'kids',
  },
  {
    id: 'kids-babies',
    name: 'Babies',
    description: 'Baby clothing and accessories',
    image: '/categories/kids/babies/main.png',
    slug: 'kids/babies',
    parentId: 'kids',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    image: '/categories/men/accessories/main.png',
    slug: 'accessories',
    featured: true,
  }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getSubcategories = (parentId: string): Category[] => {
  return categories.filter(category => category.parentId === parentId);
};

export const getFeaturedCategories = (): Category[] => {
  return categories.filter(category => category.featured);
};
