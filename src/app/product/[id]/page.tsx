'use client';

import { useRouter, useParams } from 'next/navigation';
import Toast from '../../../components/Toast';
import { useCart } from '../../../context/CartContext';
import AddToCartModal from '../../../components/AddToCartModal';
import { useCallback, useState } from 'react';
import Image from 'next/image';


export default function ProductDetail() {
  const [selectedMedia, setSelectedMedia] = useState('/images/Tops.jpg'); 
  const router = useRouter();
  const params = useParams();
  const productIdFromUrl = params.id as string;
  const { addToCart } = useCart();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Product data
  const product = {
    id: productIdFromUrl,
    name: `Elegant Summer Dress (ID: ${productIdFromUrl})`,
    price: 99.99,
    originalPrice: 129.99,
    reviews: 150,
    description: 'A beautiful summer dress made with lightweight, breathable fabric perfect for warm days.',
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      { label: 'Material', value: '100% Cotton' },
      { label: 'Care Instructions', value: 'Machine wash cold, tumble dry low' },
      { label: 'Style', value: 'Casual, Summer' },
      { label: 'Length', value: 'Midi' }
    ],
    images: [
      '/images/Tops.jpg',
      '/images/summer.png',
      '/images/summer2.png',
      '/images/summer3.png',
    ]
  };

  const handleImageClick = useCallback((src: string) => {
    setSelectedMedia(src);
  }, []);

  const handleImageKeyDown = useCallback(
    (event: React.KeyboardEvent, src: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleImageClick(src);
      }
    },
    [handleImageClick]
  );

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
      setShowToast({ message: 'Please log in to continue adding items to your cart.', type: 'error' });
      router.push('/login');
      return;
    }

    if (!selectedSize) {
      setShowToast({ message: 'Please select a size.', type: 'error' });
      return;
    }

    const itemToAdd = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: quantity,
    };

    await addToCart(itemToAdd);
    setShowToast({ message: 'Item added to cart!', type: 'success' });
    setShowAddToCartModal(true);
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Media Section */}
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-200">
              <Image
                src={selectedMedia}
                alt="Selected product view"
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-75 ${
                    selectedMedia === image ? 'ring-2 ring-purple-600' : ''
                  }`}
                  onClick={() => handleImageClick(image)}
                  tabIndex={0}
                  onKeyDown={(e) => handleImageKeyDown(e, image)}
                >
                  <Image
                    src={image}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-purple-600">৳{product.price}</span>
              <span className="text-gray-500 line-through">৳{product.originalPrice}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Product Details */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="space-y-2">
                {product.details.map((detail, index) => (
                  <div key={index} className="flex">
                    <span className="w-1/3 text-gray-600">{detail.label}:</span>
                    <span className="w-2/3">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-10 h-10 border rounded-md flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-colors ${
                      selectedSize === size ? 'border-purple-600 text-purple-600' : ''
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 border rounded-md flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-colors"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 text-center border rounded-md p-1"
                />
                <button
                  className="w-8 h-8 border rounded-md flex items-center justify-center hover:border-purple-600 hover:text-purple-600 transition-colors"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mb-4"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={showToast.message}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}
      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        product={{
          name: product.name,
          image: product.images[0],
          price: product.price,
        }}
        selectedSize={selectedSize || ''}
        quantity={quantity}
      />
    </main>
  );
}
