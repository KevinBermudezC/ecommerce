import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useTheme } from '../lib/useTheme';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discountPercentage?: number;
}

// Temporary mock data - will be replaced with API calls
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Classic White Sneakers',
    price: 99.99,
    image: '/product-1.jpg',
    category: 'men',
    isNew: true,
    discountPercentage: 10
  },
  {
    id: 2,
    name: 'Running Shoes',
    price: 129.99,
    image: '/product-2.jpg',
    category: 'men'
  },
  {
    id: 3,
    name: 'Sport T-Shirt',
    price: 39.99,
    image: '/product-3.jpg',
    category: 'men'
  },
  {
    id: 4,
    name: 'Casual Jacket',
    price: 149.99,
    image: '/product-4.jpg',
    category: 'kids'
  },
  {
    id: 5,
    name: 'Summer Dress',
    price: 89.99,
    image: '/product-5.jpg',
    category: 'women',
    isNew: true
  },
  {
    id: 6,
    name: 'Kids T-Shirt',
    price: 29.99,
    image: '/product-6.jpg',
    category: 'kids'
  },
  {
    id: 7,
    name: 'Sport Shorts',
    price: 49.99,
    image: '/product-7.jpg',
    category: 'men'
  },
  {
    id: 8,
    name: 'Women\'s Hoodie',
    price: 69.99,
    image: '/product-8.jpg',
    category: 'women'
  }
];

export default function ProductList() {
  const { theme } = useTheme();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL parameters for initial state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
    
    const path = location.pathname;
    if (path.includes('/men')) {
      setSelectedCategory('men');
    } else if (path.includes('/women')) {
      setSelectedCategory('women');
    } else if (path.includes('/kids')) {
      setSelectedCategory('kids');
    }
  }, [location]);

  // Simular carga de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = mockProducts
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // For 'newest', sort by isNew flag (true comes first)
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });

  const categoryTitle = selectedCategory === 'all' 
    ? 'All Products' 
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}'s Collection`;

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{categoryTitle}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our collection of high-quality products designed for comfort and style.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Sidebar on desktop, dropdown on mobile */}
        <div className="lg:w-1/4">
          <div className="lg:sticky lg:top-24">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
              <button 
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="lg:hidden flex items-center text-sm font-medium dark:text-white"
              >
                {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                <svg 
                  className={`ml-2 w-4 h-4 transition-transform ${isFiltersVisible ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className={`space-y-6 ${isFiltersVisible ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filter */}
              <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-3 dark:text-white">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value="all" 
                      checked={selectedCategory === 'all'} 
                      onChange={() => setSelectedCategory('all')}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300">All Categories</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value="men" 
                      checked={selectedCategory === 'men'} 
                      onChange={() => setSelectedCategory('men')}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300">Men</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value="women" 
                      checked={selectedCategory === 'women'} 
                      onChange={() => setSelectedCategory('women')}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300">Women</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      value="kids" 
                      checked={selectedCategory === 'kids'} 
                      onChange={() => setSelectedCategory('kids')}
                      className="mr-2"
                    />
                    <span className="dark:text-gray-300">Kids</span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter - Reemplazado con el componente Slider */}
              <div className="border-b pb-6 border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 dark:text-white">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm dark:text-gray-400">${priceRange[0]}</span>
                    <span className="text-sm dark:text-gray-400">${priceRange[1]}</span>
                  </div>
                  <div className="py-4">
                    <Slider
                      defaultValue={[0, 200]}
                      min={0}
                      max={200}
                      step={1}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="sr-only">Min Price</label>
                      <input 
                        type="number" 
                        min="0" 
                        max={priceRange[1]} 
                        value={priceRange[0]} 
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="sr-only">Max Price</label>
                      <input 
                        type="number" 
                        min={priceRange[0]} 
                        max="200" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <h3 className="font-medium mb-3 dark:text-white">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest')}
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredProducts.length} products
            </p>
            <div className="lg:hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest')}
                className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                // Skeleton loader para productos
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-1/3" />
                    </div>
                  </div>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="group">
                    <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      {product.discountPercentage && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 dark:text-white">{product.name}</h3>
                    <div className="flex items-center">
                      {product.discountPercentage ? (
                        <>
                          <p className="text-red-500 dark:text-red-400 font-medium">
                            ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                          </p>
                          <p className="ml-2 text-gray-500 line-through text-sm">
                            ${product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}