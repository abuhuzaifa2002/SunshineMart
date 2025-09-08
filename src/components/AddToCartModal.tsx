'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    price: number;
  };
  selectedSize: string;
  quantity: number;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize,
  quantity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-gray-900">Item Added to Cart!</h3>
        </div>

        <div className="flex items-center mb-6 border-b pb-4">
          <div className="w-20 h-20 flex-shrink-0 relative rounded-md overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600">Size: {selectedSize}</p>
            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
            <p className="text-lg font-semibold text-purple-600">৳{product.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Link href="/dashboard/cart" passHref>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
              View Cart ({quantity} items)
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;