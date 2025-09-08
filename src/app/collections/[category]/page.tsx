'use client';

import Filter from '@/components/Filters';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function CollectionDetail() {
  // Capitalize the first letter of the category
  const categoryTitle = 'SUNSHINE BD';

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-display text-4xl font-bold text-transparent">
            {categoryTitle} Collection
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Discover our latest categoryTitle collection, designed to make you
            look and feel amazing
          </p>
        </div>

        {/* Filters */}
        <Filter />

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
}

// "use client"
// import Filter from '@/components/Filters';
// import ProductCard from '@/components/ProductCard';
// import { products } from '@/data/products';

// export default function CollectionDetail() {

//   // Capitalize the first letter of the category
//   const categoryTitle = 'SUNSHINE BD';

//   return (
//     <main className="min-h-screen py-8 bg-gradient-to-b from-white to-amber-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold font-display mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
//             {categoryTitle} Collection
//           </h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Discover our latest categoryTitle collection, designed to make you look and feel amazing
//           </p>
//         </div>

//         {/* Filters */}
//         <Filter />

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {products.map((product) => (
//             <ProductCard key={product.id} {...product} />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }