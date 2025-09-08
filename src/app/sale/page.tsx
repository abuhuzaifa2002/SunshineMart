'use client';

import Link from 'next/link';
import Filter from '@/components/Filters';
import ProductCard from '@/components/ProductCard';

export default function SalePage() {

  // Sample sale products data - In a real app, this would come from an API
  const saleProducts = [
    {
      id: 1,
      name: 'Designer Evening Gown',
      price: 149.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800',
      rating: 4.8,
      reviews: 42,
      sizes: ['S', 'M', 'L'],
      availability: 'Limited Stock',
      discount: 50
    },
    {
      id: 2,
      name: 'Premium Leather Jacket',
      price: 199.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=800',
      rating: 4.9,
      reviews: 38,
      sizes: ['M', 'L', 'XL'],
      availability: 'In Stock',
      discount: 50
    },
    {
      id: 3,
      name: 'Silk Cocktail Dress',
      price: 89.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800',
      rating: 4.7,
      reviews: 29,
      sizes: ['XS', 'S', 'M'],
      availability: 'Few Left',
      discount: 40
    },
    {
      id: 4,
      name: 'Cashmere Sweater',
      price: 79.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800',
      rating: 4.6,
      reviews: 35,
      sizes: ['S', 'M', 'L', 'XL'],
      availability: 'In Stock',
      discount: 50
    },
    {
      id: 5,
      name: 'Designer Handbag',
      price: 299.99,
      originalPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800',
      rating: 4.9,
      reviews: 56,
      sizes: ['One Size'],
      availability: 'Limited Edition',
      discount: 40
    },
    {
      id: 6,
      name: 'Summer Collection Dress',
      price: 69.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800',
      rating: 4.5,
      reviews: 45,
      sizes: ['XS', 'S', 'M', 'L'],
      availability: 'In Stock',
      discount: 46
    }
  ];

  return (
    <main className="min-h-screen pb-8 bg-gradient-to-b from-white to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20 mb-12">
        <div className="absolute inset-0 pattern-diagonal-lines opacity-10 "></div>
        <div className="container mx-auto px-4 relative z-10 dark:bg-black">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-amber-200 font-medium tracking-wider text-sm mb-3 block animate-fade-in">SPECIAL OFFERS</span>
            <h1 className="text-5xl font-bold font-display mb-6 animate-slide-up">
              Summer Sale
              <span className="block text-amber-200">Up to 50% Off</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 animate-fade-in-delay">
              Do not miss out on our biggest sale of the season. Limited time offers on premium fashion items.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="#sale-items" 
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop Now
              </Link>
              <Link 
                href="/collections" 
                className="bg-orange-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-800 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                View Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4" id="sale-items">
        {/* Filters */}
        <Filter />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {saleProducts.map((product) => (
           <ProductCard key={product.id} {...product}/>
          ))}
        </div>
      </div>
    </main>
  );
}