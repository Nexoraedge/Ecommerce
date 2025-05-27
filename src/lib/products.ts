export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  brand: string;
  maxQuantity: number;
  rating: number;
  reviews: number;
  specifications: {
    [key: string]: string;
  };
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export const products: Product[] = [
  // Men's Products
  {
    id: 'mens-casual-shirt',
    name: 'Casual Linen Shirt',
    description: 'Comfortable and stylish linen shirt perfect for casual wear.',
    price: 49.99,
    images: [
      'https://picsum.photos/seed/mens-shirt1/800/800',
      'https://picsum.photos/seed/mens-shirt2/800/800',
      'https://picsum.photos/seed/mens-shirt3/800/800',
    ],
    category: 'men-clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Beige'],
    brand: 'Fashion Brand',
    maxQuantity: 10,
    rating: 4.5,
    reviews: 128,
    specifications: {
      Material: '100% Linen',
      Fit: 'Regular',
      Care: 'Machine wash cold',
    },
  },
  {
    id: 'mens-sneakers',
    name: 'Classic Sneakers',
    description: 'Versatile and comfortable sneakers for everyday wear.',
    price: 79.99,
    images: [
      'https://picsum.photos/seed/mens-shoes1/800/800',
      'https://picsum.photos/seed/mens-shoes2/800/800',
      'https://picsum.photos/seed/mens-shoes3/800/800',
    ],
    category: 'men-shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Gray'],
    brand: 'SportFlex',
    maxQuantity: 5,
    rating: 4.7,
    reviews: 95,
    specifications: {
      Material: 'Leather and mesh',
      Sole: 'Rubber',
      Features: 'Cushioned insole',
    },
  },

  // Women's Products
  {
    id: 'womens-summer-dress',
    name: 'Floral Summer Dress',
    description: 'Light and breezy summer dress with floral print.',
    price: 69.99,
    images: [
      'https://picsum.photos/seed/womens-dress1/800/800',
      'https://picsum.photos/seed/womens-dress2/800/800',
      'https://picsum.photos/seed/womens-dress3/800/800',
    ],
    category: 'women-clothing',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue Floral', 'Pink Floral', 'Yellow Floral'],
    brand: 'Style Co',
    maxQuantity: 8,
    rating: 4.8,
    reviews: 156,
    specifications: {
      Material: '100% Cotton',
      Length: 'Midi',
      Care: 'Hand wash cold',
    },
  },
  {
    id: 'womens-handbag',
    name: 'Leather Tote Bag',
    description: 'Elegant leather tote bag with plenty of storage.',
    price: 129.99,
    images: [
      'https://picsum.photos/seed/womens-bag1/800/800',
      'https://picsum.photos/seed/womens-bag2/800/800',
      'https://picsum.photos/seed/womens-bag3/800/800',
    ],
    category: 'women-accessories',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan'],
    brand: 'Luxe Leather',
    maxQuantity: 3,
    rating: 4.9,
    reviews: 82,
    specifications: {
      Material: 'Genuine leather',
      Size: 'Large',
      Features: 'Multiple compartments',
    },
  },

  // Kids' Products
  {
    id: 'kids-tshirt-set',
    name: 'Kids T-Shirt Set',
    description: 'Comfortable cotton t-shirt set for kids.',
    price: 29.99,
    images: [
      'https://picsum.photos/seed/kids-tshirt1/800/800',
      'https://picsum.photos/seed/kids-tshirt2/800/800',
      'https://picsum.photos/seed/kids-tshirt3/800/800',
    ],
    category: 'kids-boys',
    sizes: ['4T', '5T', '6T'],
    colors: ['Multi'],
    brand: 'Kids Comfort',
    maxQuantity: 10,
    rating: 4.6,
    reviews: 45,
    specifications: {
      Material: '100% Cotton',
      Pack: '3 pieces',
      Care: 'Machine wash',
    },
  },
  {
    id: 'kids-dress',
    name: 'Girls Party Dress',
    description: 'Beautiful party dress for special occasions.',
    price: 49.99,
    images: [
      'https://picsum.photos/seed/kids-dress1/800/800',
      'https://picsum.photos/seed/kids-dress2/800/800',
      'https://picsum.photos/seed/kids-dress3/800/800',
    ],
    category: 'kids-girls',
    sizes: ['4', '5', '6', '7'],
    colors: ['Pink', 'Purple', 'White'],
    brand: 'Little Princess',
    maxQuantity: 5,
    rating: 4.8,
    reviews: 67,
    specifications: {
      Material: 'Polyester blend',
      Style: 'Party wear',
      Care: 'Hand wash',
    },
  },
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'Premium quality cotton t-shirt with a comfortable fit and stylish design.',
    price: 29.99,
    images: [
      'https://picsum.photos/seed/product1/800/800',
      'https://picsum.photos/seed/product1-2/800/800',
      'https://picsum.photos/seed/product1-3/800/800',
    ],
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    brand: 'Fashion Brand',
    maxQuantity: 10,
    rating: 4.5,
    reviews: 128,
    specifications: {
      Material: '100% Cotton',
      Fit: 'Regular',
      Care: 'Machine wash cold',
    },
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with stretch comfort and classic style.',
    price: 59.99,
    images: [
      'https://picsum.photos/seed/product2/800/800',
      'https://picsum.photos/seed/product2-2/800/800',
      'https://picsum.photos/seed/product2-3/800/800',
    ],
    category: 'Jeans',
    sizes: ['30x32', '32x32', '34x32', '36x32'],
    colors: ['Blue', 'Black', 'Gray'],
    brand: 'Denim Co',
    maxQuantity: 8,
    rating: 4.3,
    reviews: 95,
    specifications: {
      Material: '98% Cotton, 2% Elastane',
      Fit: 'Slim',
      Rise: 'Mid-rise',
    },
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Lightweight and comfortable running shoes with superior cushioning.',
    price: 89.99,
    images: [
      'https://picsum.photos/seed/product3/800/800',
      'https://picsum.photos/seed/product3-2/800/800',
      'https://picsum.photos/seed/product3-3/800/800',
    ],
    category: 'Shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'Blue/Gray', 'Red/Black'],
    brand: 'SportFlex',
    maxQuantity: 5,
    rating: 4.7,
    reviews: 216,
    specifications: {
      Material: 'Mesh and synthetic upper',
      Sole: 'Rubber',
      Cushioning: 'Responsive foam',
    },
  },
  {
    id: '4',
    name: 'Leather Backpack',
    description: 'Stylish and durable leather backpack perfect for daily use.',
    price: 119.99,
    images: [
      'https://picsum.photos/seed/product4/800/800',
      'https://picsum.photos/seed/product4-2/800/800',
      'https://picsum.photos/seed/product4-3/800/800',
    ],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    brand: 'Urban Gear',
    maxQuantity: 3,
    rating: 4.8,
    reviews: 73,
    specifications: {
      Material: 'Genuine leather',
      Capacity: '20L',
      Features: 'Laptop compartment, Water-resistant',
    },
  },
];

export const getProduct = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (category: string, currentId: string): Product[] => {
  return products
    .filter(product => product.category === category && product.id !== currentId)
    .slice(0, 4);
};

export const filterProducts = (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  brand?: string;
}) => {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.sizes && !filters.sizes.some(size => product.sizes.includes(size))) return false;
    if (filters.colors && !filters.colors.some(color => product.colors.includes(color))) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    return true;
  });
};
