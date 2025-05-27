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
    image: 'https://picsum.photos/seed/men/800/400',
    slug: 'men',
    featured: true,
  },
  {
    id: 'women',
    name: 'Women',
    description: 'Discover women\'s fashion and accessories',
    image: 'https://picsum.photos/seed/women/800/400',
    slug: 'women',
    featured: true,
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Explore children\'s clothing and accessories',
    image: 'https://picsum.photos/seed/kids/800/400',
    slug: 'kids',
    featured: true,
  },
  // Men's subcategories
  {
    id: 'men-clothing',
    name: 'Clothing',
    description: 'Men\'s clothing collection',
    image: 'https://picsum.photos/seed/men-clothing/800/400',
    slug: 'men/clothing',
    parentId: 'men',
  },
  {
    id: 'men-shoes',
    name: 'Shoes',
    description: 'Men\'s footwear collection',
    image: 'https://picsum.photos/seed/men-shoes/800/400',
    slug: 'men/shoes',
    parentId: 'men',
  },
  {
    id: 'men-accessories',
    name: 'Accessories',
    description: 'Men\'s accessories collection',
    image: 'https://picsum.photos/seed/men-accessories/800/400',
    slug: 'men/accessories',
    parentId: 'men',
  },
  // Women's subcategories
  {
    id: 'women-clothing',
    name: 'Clothing',
    description: 'Women\'s clothing collection',
    image: 'https://picsum.photos/seed/women-clothing/800/400',
    slug: 'women/clothing',
    parentId: 'women',
  },
  {
    id: 'women-shoes',
    name: 'Shoes',
    description: 'Women\'s footwear collection',
    image: 'https://picsum.photos/seed/women-shoes/800/400',
    slug: 'women/shoes',
    parentId: 'women',
  },
  {
    id: 'women-accessories',
    name: 'Accessories',
    description: 'Women\'s accessories collection',
    image: 'https://picsum.photos/seed/women-accessories/800/400',
    slug: 'women/accessories',
    parentId: 'women',
  },
  // Kids' subcategories
  {
    id: 'kids-boys',
    name: 'Boys',
    description: 'Boys\' clothing and accessories',
    image: 'https://picsum.photos/seed/kids-boys/800/400',
    slug: 'kids/boys',
    parentId: 'kids',
  },
  {
    id: 'kids-girls',
    name: 'Girls',
    description: 'Girls\' clothing and accessories',
    image: 'https://picsum.photos/seed/kids-girls/800/400',
    slug: 'kids/girls',
    parentId: 'kids',
  },
  {
    id: 'kids-babies',
    name: 'Babies',
    description: 'Baby clothing and accessories',
    image: 'https://picsum.photos/seed/kids-babies/800/400',
    slug: 'kids/babies',
    parentId: 'kids',
  },
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
