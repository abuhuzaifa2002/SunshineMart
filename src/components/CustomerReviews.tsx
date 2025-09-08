'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface CustomerReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  images?: string[]; // Added support for review images
}

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  productRating: number;
  onWriteReview?: () => void;
  className?: string;
  maxHeight?: string;
  showWriteReviewButton?: boolean;
}

export default function CustomerReviews({
  reviews,
  productRating,
  onWriteReview,
  className = '',
  maxHeight = 'max-h-64',
  showWriteReviewButton = true,
}: CustomerReviewsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Fallback to placeholder if image fails to load
      e.currentTarget.src = '/images/placeholder.jpg';
    },
    []
  );
  const renderStarRating = useCallback(
    (rating: number, size: 'sm' | 'md' = 'sm') => {
      const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <motion.svg
              animate={{ opacity: 1, scale: 1 }}
              className={`${starSize} ${
                i < rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              initial={{ opacity: 0, scale: 0 }}
              key={i}
              transition={{
                delay: 0.1 + i * 0.05,
                type: 'spring',
                stiffness: 200,
              }}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </motion.svg>
          ))}
        </div>
      );
    },
    []
  );

  const handleWriteReview = useCallback(() => {
    if (onWriteReview) {
      onWriteReview();
    }
  }, [onWriteReview]);

  const handleImageClick = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
  }, []);

  const handleImageClickWrapper = useCallback(
    (image: string) => {
      return () => handleImageClick(image);
    },
    [handleImageClick]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleModalContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`border-t border-gray-200 pt-6 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-900">
            Customer Reviews
          </h4>
          <div className="flex items-center space-x-4">
            {renderStarRating(Math.floor(productRating), 'md')}
            <span className="text-sm text-gray-600">
              {productRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>

        {/* Reviews List */}
        <div className={`space-y-4 ${maxHeight} overflow-y-auto`}>
          {reviews.map((review, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-gray-50 p-4"
              initial={{ opacity: 0, y: 20 }}
              key={review.id}
              transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              {/* Review Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {review.name}
                    </span>
                    {review.verified ? (
                      <motion.span
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                        }}
                      >
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            clipRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            fillRule="evenodd"
                          />
                        </svg>
                        Verified
                      </motion.span>
                    ) : null}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-2">{renderStarRating(review.rating)}</div>

              {/* Comment */}
              <motion.p
                animate={{ opacity: 1 }}
                className="text-sm leading-relaxed text-gray-700"
                initial={{ opacity: 0 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.3,
                }}
              >
                {review.comment}
              </motion.p>

              {/* Review Images */}
              {review.images && review.images.length > 0 ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    duration: 0.3,
                  }}
                >
                  <div className="flex flex-wrap gap-2">
                    {review.images.map((image, imageIndex) => (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative cursor-pointer overflow-hidden rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        key={imageIndex}
                        transition={{
                          delay: 0.7 + index * 0.1 + imageIndex * 0.05,
                          duration: 0.2,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleImageClickWrapper(image)}
                      >
                        <Image
                          alt={`Review image ${imageIndex + 1} by ${review.name}`}
                          className="h-16 w-16 object-cover transition-transform duration-200 hover:brightness-110"
                          height={64}
                          src={image}
                          width={64}
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-200 hover:bg-opacity-10" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {review.images.length} photo
                    {review.images.length > 1 ? 's' : ''} from customer
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* Write Review Button */}
        {showWriteReviewButton ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 border-t border-gray-200 pt-4"
            initial={{ opacity: 0, y: 20 }}
            transition={{
              delay: 0.6,
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <motion.button
              className="w-full rounded-lg border-2 border-orange-500 px-4 py-2 font-medium text-orange-600 transition-colors duration-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.2,
                    ease: 'easeOut',
                  },
                },
                hover: {
                  scale: 1.02,
                  transition: {
                    duration: 0.2,
                    ease: 'easeInOut',
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
              onClick={handleWriteReview}
            >
              📷 Write a Review with Photos
            </motion.button>
          </motion.div>
        ) : null}
      </motion.div>

      {/* Image Modal */}
      {selectedImage ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-h-full max-w-full"
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleModalContentClick}
          >
            <Image
              priority
              alt="Review image"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              height={600}
              src={selectedImage}
              style={{ width: 'auto', height: 'auto' }}
              width={800}
            />
            <motion.button
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseModal}
            >
              <svg
                className="h-4 w-4"
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
        </motion.div>
      ) : null}
    </>
  );
}
