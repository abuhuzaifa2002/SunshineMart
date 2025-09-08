import Image from 'next/image';
import Link from 'next/link';

const Trending = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="dark:bg-black dark:text-white">
        <div className="container mx-auto px-4 dark:bg-black dark:text-white">
          <div className="mb-16 text-center">
            <span className="mb-2 block text-sm font-medium tracking-wider text-orange-600">
              WHAT&apos;S HOT
            </span>
            <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text font-display text-4xl font-bold text-transparent">
              Trending Styles
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Discover the latest fashion trends and must-have pieces of the
              season
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="group relative h-[500px] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl">
              <Image
                fill
                alt="Summer Collection"
                className="transform object-cover transition-transform duration-700 group-hover:scale-110"
                src="/images/dresses.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-10 transition-transform duration-300 group-hover:translate-y-0">
                <div className="text-white">
                  <span className="mb-2 inline-block text-sm font-medium tracking-wider text-orange-300">
                    NEW SEASON
                  </span>
                  <h3 className="mb-3 font-display text-3xl font-bold">
                    Summer Collection
                  </h3>
                  <p className="mb-6 max-w-md text-white/90">
                    Embrace the warmth with our curated selection of breezy&lsquo;
                    stylish pieces perfect for sunny days
                  </p>
                  <Link
                    className="group/btn inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-orange-600"
                    href="/collections/summer"
                  >
                    <span>Explore Collection</span>
                    <svg
                      className="ml-2 h-5 w-5 transform transition-transform group-hover/btn:translate-x-1"
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
                  </Link>
                </div>
              </div>
            </div>
            <div className="group relative h-[500px] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl">
              <Image
                fill
                alt="Elegant Evening Wear"
                className="transform object-cover transition-transform duration-700 group-hover:scale-110"
                src="/images/bag.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-10 transition-transform duration-300 group-hover:translate-y-0">
                <div className="text-white">
                  <span className="mb-2 inline-block text-sm font-medium tracking-wider text-orange-300">
                    LUXURY EDIT
                  </span>
                  <h3 className="mb-3 font-display text-3xl font-bold">
                    Elegant Evening Wear
                  </h3>
                  <p className="mb-6 max-w-md text-white/90">
                    Make a statement with our sophisticated collection of evening
                    wear for special occasions
                  </p>
                  <Link
                    className="group/btn inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-orange-600"
                    href="/collections/evening"
                  >
                    <span>Explore Collection</span>
                    <svg
                      className="ml-2 h-5 w-5 transform transition-transform group-hover/btn:translate-x-1"
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
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trending;
