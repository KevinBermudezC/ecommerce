import { useState } from 'react';
import { Link } from 'react-router';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Temporary mock data - will be replaced with API calls
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Classic White Sneakers',
    price: 99.99,
    image: '/product-1.jpg',
    category: 'men'
  },
  {
    id: 2,
    name: 'Running Shoes',
    price: 129.99,
    image: '/product-2.jpg',
    category: 'women'
  },
  {
    id: 3,
    name: 'Kids Sport Shoes',
    price: 79.99,
    image: '/product-3.jpg',
    category: 'kids'
  },
  // Add more mock products as needed
];

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-asc');

  const filteredProducts = mockProducts
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      return b.price - a.price;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">All Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc')}
            className="border p-2 rounded"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="group">
            <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}