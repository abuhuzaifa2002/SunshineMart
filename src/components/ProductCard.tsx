'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  availability: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  availability,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const discountPercentage = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );

  // Create stable function references with useCallback
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleWishlistClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsWishlisted(!isWishlisted);
    },
    [isWishlisted]
  );

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }, []);

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setIsAddingToCart(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Add to cart logic here
        const cartItem = {
          id,
          name,
          price,
          image,
          quantity,
        };

        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if item already exists in cart
        const existingItemIndex = existingCart.findIndex(
          (item: {
            id: number;
            name: string;
            price: number;
            image: string;
            quantity: number;
          }) => item.id === id
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          existingCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          existingCart.push(cartItem);
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));

        setIsAddedToCart(true);

        // Reset after 1.5 seconds
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 1500);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [id, name, price, image, quantity]
  );

  const handleBuyNow = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      // Add to cart first
      await handleAddToCart(e);

      // Redirect to checkout
      window.location.href = '/cart';
    },
    [handleAddToCart]
  );

  const handleQuantityDecrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleQuantityChange(quantity - 1);
    },
    [quantity, handleQuantityChange]
  );

  const handleQuantityIncrease = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleQuantityChange(quantity + 1);
    },
    [quantity, handleQuantityChange]
  );

  const handleQuickViewOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  const handleQuickViewClose = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  return (
    <>
      <div
        className="group relative transform overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-black dark:text-white"
        role="article"
        tabIndex={0}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link className="block" href={`/product/${id}`}>
          <div className="relative h-80 overflow-hidden">
            <Image
              fill
              alt={name}
              className="transform object-cover transition-transform duration-700 group-hover:scale-110"
              src={image}
            />

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <span className="animate-pulse rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                  -{discountPercentage}%
                </span>
              )}
              <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-orange-600 backdrop-blur-sm">
                {availability}
              </span>
            </div>

            {/* Wishlist button */}
            <button
              aria-label={
                isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
              }
              className="group/wishlist absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              onClick={handleWishlistClick}
            >
              <svg
                className={`h-5 w-5 transition-all duration-300 ${
                  isWishlisted
                    ? 'fill-current text-red-500'
                    : 'text-gray-600 group-hover/wishlist:text-red-500'
                }`}
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>

            {/* Quick View Button - Updated */}
            <div
              className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${
                isHovered
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <button
                aria-label="Quick view product"
                className="flex w-full items-center justify-center rounded-xl bg-white/90 px-4 py-3 font-medium text-orange-600 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg"
                onClick={handleQuickViewOpen}
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Quick View
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="mb-2 line-clamp-2 font-display text-lg font-semibold text-gray-800 transition-colors group-hover:text-orange-600">
              {name}
            </h3>

            <div className="mb-3 flex items-baseline">
              <span className="text-xl font-bold text-orange-600">
                ${price}
              </span>
              {originalPrice > price && (
                <>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${originalPrice}
                  </span>
                  <span className="ml-2 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <div className="mb-3 flex items-center">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? 'text-amber-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    key={i}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {rating} ({reviews})
              </span>
            </div>

            {/* Compact Quantity Selector */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                  onClick={handleQuantityDecrease}
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-medium">
                  {quantity}
                </span>
                <button
                  className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= 10}
                  onClick={handleQuantityIncrease}
                >
                  +
                </button>
              </div>
            </div>

            {/* Parallel Small Buttons */}
            <div className="flex gap-2">
              {/* Add to Cart Button */}
              <button
                aria-label={`Add ${name} to cart`}
                className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isAddedToCart
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : isAddingToCart
                      ? 'cursor-not-allowed bg-orange-400 text-white'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
                disabled={isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <>
                    <svg
                      className="mr-1 h-4 w-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Adding
                  </>
                ) : isAddedToCart ? (
                  <>
                    <svg
                      className="mr-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Added
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-1 h-4 w-4"
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
                    Add Cart
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                aria-label={`Buy ${name} now`}
                className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-orange-700 hover:to-orange-800"
                onClick={handleBuyNow}
              >
                <svg
                  className="mr-1 h-4 w-4"
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
              </button>
            </div>
          </div>
        </Link>
      </div>
      {/* Reusable Quick View Modal */}
      <QuickViewModal
        isAddedToCart={isAddedToCart}
        isAddingToCart={isAddingToCart}
        isOpen={isQuickViewOpen}
        isWishlisted={isWishlisted}
        product={{
          id,
          name,
          price,
          originalPrice,
          image,
          rating,
          reviews,
          availability,
        }}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onClose={handleQuickViewClose}
        onQuantityChange={handleQuantityChange}
        onWishlistToggle={handleWishlistClick}
      />
    </>
  );
}
