import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import ScrollVelocity from '../components/ui/ScrollVelocity';
import { useTheme } from '../lib/useTheme';

export default function Home() {
  const velocity = 20;
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "NEW SEASON ARRIVALS",
      subtitle: "Discover the latest trends in sportswear and fashion",
      image: "/hero-bg.jpg",
      cta: "SHOP NOW",
      link: "/products"
    },
    {
      title: "SUMMER COLLECTION",
      subtitle: "Light fabrics for hot days and cool nights",
      image: "/summer-collection.jpg",
      cta: "EXPLORE",
      link: "/products?category=summer"
    },
    {
      title: "EXCLUSIVE DISCOUNTS",
      subtitle: "Up to 50% off on selected items",
      image: "/sale-bg.jpg",
      cta: "SHOP SALE",
      link: "/products?sale=true"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const categories = [
    { name: "Men", image: "/men-category.jpg", link: "/men" },
    { name: "Women", image: "/women-category.jpg", link: "/women" },
    { name: "Kids", image: "/kids-category.jpg", link: "/kids" }
  ];

  const trendingProducts = [
    { id: 1, name: "Classic White Sneakers", price: 99.99, image: "/product-1.jpg" },
    { id: 2, name: "Running Shoes", price: 129.99, image: "/product-2.jpg" },
    { id: 3, name: "Sport T-Shirt", price: 39.99, image: "/product-3.jpg" },
    { id: 4, name: "Casual Jacket", price: 149.99, image: "/product-4.jpg" }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section with Carousel */}
      <section className="relative h-[90vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${slide.image})` }}></div>
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">{slide.title}</h1>
                <p className="text-xl text-white/90">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100 transition-colors"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">SHOP BY CATEGORY</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.link} 
              className="group relative h-96 overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-40 transition-opacity z-10"></div>
              <img 
                src={category.image} 
                alt={category.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 z-0" 
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-3xl font-bold text-white tracking-wide">{category.name.toUpperCase()}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <span className="inline-block bg-white px-6 py-2 font-medium text-black">{`SHOP ${category.name.toUpperCase()}`}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-12">
          <ScrollVelocity
            texts={['TRENDING', 'NOW']} 
            velocity={velocity} 
            className="custom-scroll-text"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link 
            to="/products" 
            className={`inline-block px-8 py-3 font-semibold border-2 hover:bg-black hover:text-white transition-colors ${
              theme === 'dark' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-black text-black'
            }`}
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2 dark:text-white">JOIN OUR NEWSLETTER</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none"
            />
            <button 
              className={`px-6 py-3 font-semibold transition-colors ${
                theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}