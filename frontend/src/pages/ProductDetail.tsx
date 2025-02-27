import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
}

// Temporary mock data - will be replaced with API calls
const mockProduct: Product = {
  id: 1,
  name: 'Classic White Sneakers',
  price: 99.99,
  description: 'Premium quality sneakers perfect for everyday wear. Features a comfortable insole and durable outsole.',
  image: '/product-1.jpg',
  sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11']
};

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size', {
        description: 'Please select a size before adding to cart',
      })
      return;
    }
    toast.success('Adding to cart:', {
      description: `Name: ${mockProduct.name}, Quantity: ${quantity}`
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={mockProduct.image}
            alt={mockProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{mockProduct.name}</h1>
          <p className="text-2xl text-gray-600">${mockProduct.price.toFixed(2)}</p>
          <p className="text-gray-600">{mockProduct.description}</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {mockProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 border rounded ${selectedSize === size ? 'border-black' : 'border-gray-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-24"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}