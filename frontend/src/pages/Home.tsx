import { Link } from 'react-router';
import ScrollVelocity from '../components/ui/ScrollVelocity';

export default function Home() {
  const velocity = 20;
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[100vh] bg-black text-white">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-50"></div> 
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold">NEW SEASON ARRIVALS</h1>
            <p className="text-xl">Discover the latest trends in sportswear and fashion</p>
            <Link
              to="/products"
              className="inline-block bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <ScrollVelocity
          texts={['FEATURED', 'CATEGORIES']} 
          velocity={velocity} 
          className="custom-scroll-text"
        />
        {/* <h2 className="text-3xl font-bold mb-8">FEATURED CATEGORIES</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Men', 'Women', 'Kids'].map((category) => (
            <Link
              key={category}
              to={`/${category.toLowerCase()}`}
              className="group relative h-96 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black">
                <img
                  src={`/${category.toLowerCase()}-category.jpg`}
                  alt={category}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="relative h-full flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-12">
      <ScrollVelocity
          texts={['TRENDING', 'NOW']} 
          velocity={velocity} 
          className="custom-scroll-text"
        />
        {/* <h2 className="text-3xl font-bold mb-8">TRENDING NOW</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((product) => (
            <Link key={product} to="/products/1" className="group">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <img
                  src={`/product-${product}.jpg`}
                  alt={`Product ${product}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold mb-2">Product Name</h3>
              <p className="text-gray-600">$99.99</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}