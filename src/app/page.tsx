'use client';

import Featured from '@/components/Featured';
import Hero from '@/components/Hero';
import NewArrivals from '@/components/NewArrivals';
import Trending from '@/components/Trending';

export default function App() {
  return (
    <main className="min-h-screen font-sans dark:bg-black dark:text-white">
      <Hero
        buttonLink="/collections"
        buttonText="Explore Collection"
        description="Discover curated pieces that blend timeless elegance with contemporary fashion, designed to make you shine"
        highlightedText="With Sunshine"
        title="Elevate Your Style"
      />
      {/* Featured Categories */}
      <Featured />
      {/* New Arrivals */}
      <NewArrivals />

      {/* Trending Styles */}
      <Trending />
    </main>
  );
}
