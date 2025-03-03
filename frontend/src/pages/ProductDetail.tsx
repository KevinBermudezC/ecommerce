import { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../lib/useTheme';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  image: string;
  gallery: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discountPercentage?: number;
  relatedProducts: number[];
}

// Temporary mock data - will be replaced with API calls
const mockProduct: Product = {
  id: 1,
  name: 'Classic White Sneakers',
  price: 99.99,
  description: 'Premium quality sneakers perfect for everyday wear. Features a comfortable insole and durable outsole.',
  features: [
    'Breathable mesh upper',
    'Cushioned insole for all-day comfort',
    'Durable rubber outsole',
    'Lightweight construction',
    'Versatile design for casual or athletic wear'
  ],
  image: '/product-1.jpg',
  gallery: [
    '/product-1.jpg',
    '/product-1-alt-1.jpg',
    '/product-1-alt-2.jpg',
    '/product-1-alt-3.jpg'
  ],
  sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
  colors: [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#888888' }
  ],
  category: 'men',
  inStock: true,
  rating: 4.5,
  reviews: 124,
  isNew: true,
  discountPercentage: 10,
  relatedProducts: [2, 3, 4]
};

// Mock related products
const relatedProducts = [
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
    category: 'men'
  }
];

export default function ProductDetail() {
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(mockProduct.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(mockProduct.image);
  const [tab, setTab] = useState<'description' | 'features' | 'reviews'>('description');

  const discountedPrice = mockProduct.discountPercentage
    ? mockProduct.price * (1 - mockProduct.discountPercentage / 100)
    : mockProduct.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size', {
        description: 'Please select a size before adding to cart',
      })
      return;
    }
    toast.success('Added to cart!', {
      description: `${mockProduct.name}, Size: ${selectedSize}, Color: ${selectedColor}, Quantity: ${quantity}`
    });
  };

  // Generate stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Home</a>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-500">/</span>
            <a href={`/${mockProduct.category}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              {mockProduct.category.charAt(0).toUpperCase() + mockProduct.category.slice(1)}
            </a>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900 dark:text-white">{mockProduct.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={activeImage}
              alt={mockProduct.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {mockProduct.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 ${
                  activeImage === img ? 'ring-2 ring-black dark:ring-white' : ''
                }`}
              >
                <img
                  src={img}
                  alt={`${mockProduct.name} - View ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            {/* Product badges */}
            <div className="flex space-x-2 mb-2">
              {mockProduct.isNew && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                  NEW
                </span>
              )}
              {mockProduct.discountPercentage && (
                <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                  {mockProduct.discountPercentage}% OFF
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold dark:text-white">{mockProduct.name}</h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(mockProduct.rating)}
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                ({mockProduct.reviews} reviews)
              </span>
            </div>

            <div className="mt-4">
              {mockProduct.discountPercentage ? (
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ${discountedPrice.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    ${mockProduct.price.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold dark:text-white">
                  ${mockProduct.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Stock status */}
          <p className={`text-sm ${mockProduct.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {mockProduct.inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Color selection */}
          <div>
            <h3 className="text-sm font-medium mb-3 dark:text-white">Color</h3>
            <div className="flex space-x-2">
              {mockProduct.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    selectedColor === color.name
                      ? 'ring-2 ring-offset-2 ring-black dark:ring-white'
                      : ''
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Color: ${color.name}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium dark:text-white">Size</h3>
              <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Size Guide
              </a>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {mockProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-1 border rounded-md text-sm font-medium transition-colors
                    ${selectedSize === size 
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black' 
                      : 'border-gray-300 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please select a size</p>
            )}
          </div>

          {/* Quantity selector */}
          <div>
            <h3 className="text-sm font-medium mb-3 dark:text-white">Quantity</h3>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md w-fit">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border-r border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              >
                -
              </button>
              <span className="w-12 text-center text-gray-900 dark:text-white py-2">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3 py-2 border-l border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!mockProduct.inStock}
              className={`px-8 py-3 font-semibold flex-1 flex justify-center items-center text-white
                ${mockProduct.inStock 
                  ? 'bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200' 
                  : 'bg-gray-400 cursor-not-allowed'} 
                transition-colors`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            <button className="px-3 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setTab('description')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                tab === 'description'
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setTab('features')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                tab === 'features'
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setTab('reviews')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                tab === 'reviews'
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Reviews ({mockProduct.reviews})
            </button>
          </nav>
        </div>

        <div className="py-6">
          {tab === 'description' && (
            <div className="prose max-w-none dark:prose-invert dark:text-gray-300">
              <p>{mockProduct.description}</p>
            </div>
          )}

          {tab === 'features' && (
            <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
              {mockProduct.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          )}

          {tab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium dark:text-white">Customer Reviews</h2>
                  <div className="flex items-center mt-1">
                    <div className="flex mr-2">
                      {renderStars(mockProduct.rating)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Based on {mockProduct.reviews} reviews</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium dark:text-white">
                  Write a Review
                </button>
              </div>

              {/* Placeholder for reviews - would be populated from API */}
              <p className="text-gray-600 dark:text-gray-400 italic">Reviews will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      <div>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
            <a key={product.id} href={`/products/${product.id}`} className="group">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}