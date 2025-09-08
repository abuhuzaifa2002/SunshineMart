'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import CustomerReviews, { CustomerReview } from './CustomerReviews';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  availability: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  onWishlistToggle: (e: React.MouseEvent) => void;
  isWishlisted: boolean;
  isAddingToCart: boolean;
  isAddedToCart: boolean;
  className?: string;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isWishlisted,
  isAddingToCart,
  isAddedToCart,
  className = '',
}: QuickViewModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleQuantityDecrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (quantity > 1) {
        onQuantityChange(quantity - 1);
      }
    },
    [quantity, onQuantityChange]
  );

  const handleQuantityIncrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (quantity < 10) {
        onQuantityChange(quantity + 1);
      }
    },
    [quantity, onQuantityChange]
  );

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleWriteReview = useCallback(() => {
    // Handle write review action
    // console.log('Write review clicked');
    // You can implement modal opening, navigation, etc.
  }, []);

  if (!product) return null;

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Sample customer reviews data (in a real app, this would come from props or API)
  const customerReviews: CustomerReview[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment:
        'Absolutely love this product! The quality is amazing and it fits perfectly. Highly recommend!',
      date: '2024-01-15',
      verified: true,
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 4,
      comment:
        'Great value for money. Fast shipping and exactly as described. Will buy again!',
      date: '2024-01-10',
      verified: true,
    },
    {
      id: 3,
      name: 'Emma Wilson',
      rating: 5,
      comment:
        'Exceeded my expectations! The material is so soft and comfortable. Perfect for daily wear.',
      date: '2024-01-08',
      verified: false,
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          animate="visible"
          aria-labelledby="quick-view-title"
          aria-modal="true"
          className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm ${className}`}
          exit="exit"
          initial="hidden"
          role="dialog"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut' as const,
              },
            },
            exit: {
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn' as const,
              },
            },
          }}
          onClick={handleBackdropClick}
        >
          <motion.div
            animate="visible"
            className="w-full max-w-5xl rounded-t-3xl bg-white shadow-2xl"
            exit="exit"
            initial="hidden"
            style={{ maxHeight: '90vh' }}
            variants={{
              hidden: {
                y: '100%',
                opacity: 0,
                scale: 0.95,
              },
              visible: {
                y: 0,
                opacity: 1,
                scale: 1,
                transition: {
                  type: 'spring' as const,
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4,
                },
              },
              exit: {
                y: '100%',
                opacity: 0,
                scale: 0.95,
                transition: {
                  duration: 0.3,
                  ease: 'easeIn' as const,
                },
              },
            }}
            onClick={handleContentClick}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between border-b border-gray-200 p-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.3,
                    ease: 'easeOut' as const,
                  },
                },
              }}
            >
              <h2
                className="text-xl font-bold text-gray-900"
                id="quick-view-title"
              >
                Quick View
              </h2>
              <motion.button
                aria-label="Close quick view"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.2,
                      ease: 'easeOut' as const,
                    },
                  },
                  hover: {
                    scale: 1.02,
                    transition: {
                      duration: 0.2,
                      ease: 'easeInOut' as const,
                    },
                  },
                  tap: {
                    scale: 0.98,
                    transition: {
                      duration: 0.1,
                    },
                  },
                }}
                whileHover="hover"
                whileTap="tap"
                onClick={onClose}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </motion.button>
            </motion.div>

            {/* Content */}
            <motion.div
              animate="visible"
              className="max-h-[calc(90vh-120px)] overflow-y-auto p-6"
              exit="exit"
              initial="hidden"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.4,
                    ease: 'easeOut' as const,
                    staggerChildren: 0.1,
                  },
                },
                exit: {
                  opacity: 0,
                  y: 20,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
            >
              <div className="grid gap-8 md:grid-cols-2">
                {/* Product Image */}
                <motion.div
                  className="relative aspect-square overflow-hidden rounded-2xl"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: 'easeOut' as const,
                      },
                    },
                  }}
                >
                  <Image
                    fill
                    priority
                    alt={product.name}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={product.image}
                  />
                  {discountPercentage > 0 && (
                    <motion.span
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
                      initial={{ scale: 0, rotate: -180 }}
                      transition={{
                        delay: 0.3,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      -{discountPercentage}%
                    </motion.span>
                  )}
                </motion.div>

                {/* Product Details */}
                <motion.div
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: 'easeOut' as const,
                      },
                    },
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut' as const,
                        },
                      },
                    }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <motion.span
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600"
                      initial={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.4 }}
                    >
                      {product.availability}
                    </motion.span>
                  </motion.div>

                  {/* Price */}
                  <motion.div
                    className="flex items-baseline space-x-2"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut' as const,
                        },
                      },
                    }}
                  >
                    <motion.span
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-orange-600"
                      initial={{ scale: 0 }}
                      transition={{
                        delay: 0.5,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      ${product.price}
                    </motion.span>
                    {product.originalPrice > product.price && (
                      <>
                        <motion.span
                          animate={{ opacity: 1 }}
                          className="text-lg text-gray-500 line-through"
                          initial={{ opacity: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          ${product.originalPrice}
                        </motion.span>
                        <motion.span
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-full bg-green-50 px-2 py-1 text-sm font-medium text-green-600"
                          initial={{ opacity: 0, scale: 0 }}
                          transition={{ delay: 0.7, type: 'spring' }}
                        >
                          Save {discountPercentage}%
                        </motion.span>
                      </>
                    )}
                  </motion.div>

                  {/* Rating */}
                  <motion.div
                    className="flex items-center space-x-2"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut' as const,
                        },
                      },
                    }}
                  >
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          animate={{ scale: 1, rotate: 0 }}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-amber-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          initial={{ scale: 0, rotate: -180 }}
                          key={i}
                          transition={{
                            delay: 0.8 + i * 0.1,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </motion.div>

                  {/* Quantity Selector */}
                  <motion.div
                    className="flex items-center space-x-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut' as const,
                        },
                      },
                    }}
                  >
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <motion.button
                        aria-label="Decrease quantity"
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                        disabled={quantity <= 1}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                              duration: 0.2,
                              ease: 'easeOut' as const,
                            },
                          },
                          hover: {
                            scale: 1.02,
                            transition: {
                              duration: 0.2,
                              ease: 'easeInOut' as const,
                            },
                          },
                          tap: {
                            scale: 0.98,
                            transition: {
                              duration: 0.1,
                            },
                          },
                        }}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleQuantityDecrease}
                      >
                        -
                      </motion.button>
                      <motion.span
                        animate={{ scale: 1 }}
                        aria-live="polite"
                        className="px-4 py-2 font-medium"
                        initial={{ scale: 1.2 }}
                        key={quantity}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {quantity}
                      </motion.span>
                      <motion.button
                        aria-label="Increase quantity"
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                        disabled={quantity >= 10}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                              duration: 0.2,
                              ease: 'easeOut' as const,
                            },
                          },
                          hover: {
                            scale: 1.02,
                            transition: {
                              duration: 0.2,
                              ease: 'easeInOut' as const,
                            },
                          },
                          tap: {
                            scale: 0.98,
                            transition: {
                              duration: 0.1,
                            },
                          },
                        }}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleQuantityIncrease}
                      >
                        +
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="space-y-3"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut' as const,
                        },
                      },
                    }}
                  >
                    <motion.button
                      aria-label={`Add ${product.name} to cart`}
                      className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isAddedToCart
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : isAddingToCart
                            ? 'cursor-not-allowed bg-orange-400 text-white'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                      disabled={isAddingToCart}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.2,
                            ease: 'easeOut' as const,
                          },
                        },
                        hover: {
                          scale: 1.02,
                          transition: {
                            duration: 0.2,
                            ease: 'easeInOut' as const,
                          },
                        },
                        tap: {
                          scale: 0.98,
                          transition: {
                            duration: 0.1,
                          },
                        },
                      }}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={onAddToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <motion.svg
                            animate={{ rotate: 360 }}
                            className="mr-2 inline h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </motion.svg>
                          Adding to Cart...
                        </>
                      ) : isAddedToCart ? (
                        <>
                          <motion.svg
                            animate={{ scale: 1 }}
                            className="mr-2 inline h-5 w-5"
                            fill="none"
                            initial={{ scale: 0 }}
                            stroke="currentColor"
                            transition={{ type: 'spring', stiffness: 200 }}
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </motion.svg>
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <svg
                            className="mr-2 inline h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      aria-label={`Buy ${product.name} now`}
                      className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.2,
                            ease: 'easeOut' as const,
                          },
                        },
                        hover: {
                          scale: 1.02,
                          transition: {
                            duration: 0.2,
                            ease: 'easeInOut' as const,
                          },
                        },
                        tap: {
                          scale: 0.98,
                          transition: {
                            duration: 0.1,
                          },
                        },
                      }}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={onBuyNow}
                    >
                      <svg
                        className="mr-2 inline h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      Buy Now
                    </motion.button>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.2,
                            ease: 'easeOut' as const,
                          },
                        },
                        hover: {
                          scale: 1.02,
                          transition: {
                            duration: 0.2,
                            ease: 'easeInOut' as const,
                          },
                        },
                        tap: {
                          scale: 0.98,
                          transition: {
                            duration: 0.1,
                          },
                        },
                      }}
                    >
                      <Link
                        className="block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        href={`/product/${product.id}`}
                        onClick={onClose}
                      >
                        View Full Details
                      </Link>
                    </motion.div>

                    <motion.button
                      aria-label={`${isWishlisted ? 'Remove from' : 'Add to'} wishlist`}
                      className={`flex w-full items-center justify-center rounded-lg border px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isWishlisted
                          ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.2,
                            ease: 'easeOut' as const,
                          },
                        },
                        hover: {
                          scale: 1.02,
                          transition: {
                            duration: 0.2,
                            ease: 'easeInOut' as const,
                          },
                        },
                        tap: {
                          scale: 0.98,
                          transition: {
                            duration: 0.1,
                          },
                        },
                      }}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={onWishlistToggle}
                    >
                      <motion.svg
                        animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
                        className={`mr-2 h-5 w-5 ${
                          isWishlisted ? 'fill-current' : ''
                        }`}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        transition={{ duration: 0.3 }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </motion.svg>
                      {isWishlisted
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>

              {/* Customer Reviews Section */}
              <CustomerReviews
                className="mt-8"
                maxHeight="max-h-64"
                productRating={product.rating}
                reviews={customerReviews}
                showWriteReviewButton={true}
                onWriteReview={handleWriteReview}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
