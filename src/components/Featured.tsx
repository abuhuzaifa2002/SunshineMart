import Image from "next/image";
import Link from "next/link";
const Featured = () => {
  return (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="dark:bg-black">
            <div className="container mx-auto px-4 ">
              <div className="text-center mb-12">
                <span className="text-orange-600 font-medium tracking-wider text-sm mb-2 block">CURATED COLLECTIONS</span>
                <h2 className="text-4xl font-bold font-display mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Shop by Category</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Explore our carefully curated collections, designed to elevate your style and express your unique personality</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {['Dresses', 'Tops', 'Bottoms', 'Accessories'].map((category) => (
                  <div key={category} className="group relative overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={{
                          Dresses: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800',
                          Tops: 'https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?auto=format&fit=crop&w=800',
                          Bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800',
                          Accessories: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800'
                        }[category] ?? 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800'}
                        alt={category}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
                        <h3 className="text-2xl font-bold font-display text-white mb-2">{category}</h3>
                        <p className="text-white/80 text-sm mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Discover our latest {category.toLowerCase()} collection</p>
                        <Link 
                          href={`/collections/${category.toLowerCase()}`}
                          className="inline-flex items-center text-white text-sm font-medium hover:text-orange-300 transition-colors"
                        >
                          <span>Shop Now</span>
                          <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
         </div>
        </div>   
      </section>
  );
};
export default Featured;