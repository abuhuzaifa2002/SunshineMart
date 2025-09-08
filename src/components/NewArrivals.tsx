import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const NewArrivals = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className='dark:bg-black dark:text-white'>
        <div className="container mx-auto px-4 dark:bg-black dark:text-white">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-sm font-medium tracking-wider text-orange-600">
              FRESH & TRENDY
            </span>
            <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-display text-4xl font-bold text-transparent">
              New Arrivals
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Discover our latest collection of fashion-forward pieces, carefully
              curated for the modern trendsetter
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
