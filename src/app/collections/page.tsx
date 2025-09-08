'use client';

import Image from 'next/image';
import Link from 'next/link';

import Filter from '@/components/Filters';

export default function Collections() {
  const categories = [
    {
      name: 'Dresses',
      image:
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800',
      itemCount: 42,
      description: 'Elegant dresses for every occasion',
    },
    {
      name: 'Tops',
      image:
        'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=800',
      itemCount: 56,
      description: 'Stylish tops and blouses',
    },
    {
      name: 'Bottoms',
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800',
      itemCount: 38,
      description: 'Comfortable and trendy bottoms',
    },
    {
      name: 'Accessories',
      image:
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800',
      itemCount: 64,
      description: 'Complete your look with our accessories',
    },
    {
      name: 'Outerwear',
      image:
        'https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?auto=format&fit=crop&w=800',
      itemCount: 29,
      description: 'Stay warm and stylish',
    },
    {
      name: 'Activewear',
      image:
        'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=800',
      itemCount: 45,
      description: 'Performance meets style',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-display text-4xl font-bold text-transparent">
            Our Collections
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explore our carefully curated collections, designed to elevate your
            style and express your unique personality
          </p>
        </div>

        {/* Filters */}
        <Filter />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              className="group relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              href={`/collections/${category.name.toLowerCase()}`}
              key={category.name}
            >
              <div className="relative h-[400px]">
                <Image
                  fill
                  alt={category.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  src={category.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-white">
                      {category.name}
                    </h2>
                    <span className="font-medium text-orange-300">
                      {category.itemCount} items
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-white/80">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-white transition-colors group-hover:text-orange-300">
                    <span>Shop Collection</span>
                    <svg
                      className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
