'use client';

import Image from 'next/image';

import Filter from '@/components/Filters';
import ProductCard from '@/components/ProductCard';

export default function NewArrivals() {
  // Sample new arrivals data - In a real app, this would come from an API
  const newArrivals = [
    {
      id: 1,
      name: 'Summer Breeze Maxi Dress',
      price: 89.99,
      originalPrice: 119.99,
      image:
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800',
      rating: 4.8,
      reviews: 12,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      availability: 'New Arrival',
      dateAdded: '2024-02-15',
    },
    {
      id: 2,
      name: 'Urban Chic Blazer',
      price: 149.99,
      originalPrice: 189.99,
      image:
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800',
      rating: 4.9,
      reviews: 8,
      sizes: ['S', 'M', 'L'],
      availability: 'Just Launched',
      dateAdded: '2024-02-14',
    },
    {
      id: 3,
      name: 'Bohemian Print Skirt',
      price: 69.99,
      originalPrice: 89.99,
      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800',
      rating: 4.7,
      reviews: 15,
      sizes: ['XS', 'S', 'M', 'L'],
      availability: 'New Arrival',
      dateAdded: '2024-02-13',
    },
    {
      id: 4,
      name: 'Contemporary Silk Blouse',
      price: 119.99,
      originalPrice: 149.99,
      image:
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800',
      rating: 4.6,
      reviews: 10,
      sizes: ['S', 'M', 'L', 'XL'],
      availability: 'Limited Edition',
      dateAdded: '2024-02-12',
    },
    {
      id: 5,
      name: 'Modern Denim Jacket',
      price: 129.99,
      originalPrice: 159.99,
      image:
        'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=800',
      rating: 4.9,
      reviews: 7,
      sizes: ['S', 'M', 'L'],
      availability: 'Just Launched',
      dateAdded: '2024-02-11',
    },
    {
      id: 6,
      name: 'Floral Print Jumpsuit',
      price: 99.99,
      originalPrice: 129.99,
      image:
        'https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?auto=format&fit=crop&w=800',
      rating: 4.8,
      reviews: 9,
      sizes: ['XS', 'S', 'M', 'L'],
      availability: 'New Arrival',
      dateAdded: '2024-02-10',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 pb-8">
      {/* Hero Section */}
      <section className="relative mb-12 overflow-hidden bg-gray-900 py-20 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            alt="New Arrivals Hero"
            className="object-cover opacity-30"
            src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=2000"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 block text-sm font-medium tracking-wider text-orange-400">
              JUST LANDED
            </span>
            <h1 className="mb-6 font-display text-5xl font-bold">
              New Arrivals
            </h1>
            <p className="mb-8 text-lg text-gray-300">
              Discover our latest collection of fashion-forward pieces,
              carefully curated for the modern trendsetter. Be the first to
              explore and shop our newest styles.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <Filter />

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
}
