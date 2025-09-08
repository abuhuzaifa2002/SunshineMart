'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import Link from 'next/link';

interface CartDisplayProps {
  setShowToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const CartDisplay: React.FC<CartDisplayProps> = ({ setShowToast }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const router = useRouter();

  const handleUpdateQuantity = async (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, size, newQuantity);
    setShowToast({ message: 'Cart updated', type: 'success' });
  };

  const handleRemoveFromCart = async (productId: string, size: string) => {
    await removeFromCart(productId, size);
    setShowToast({ message: 'Item removed from cart', type: 'success' });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 75 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/collections" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Cart Items</h2>
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={`৳{item.productId}-৳{item.size}`} className="flex items-center gap-6 pb-6 border-b last:border-b-0">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">৳{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.productId, item.size)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-xl shadow-md sticky top-24">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium">৳{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium">৳{tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-black transition-colors mt-8 font-semibold"
          >
            Proceed to Checkout
          </button>
          <div className="text-center mt-4">
            <Link href="/collections" className="text-sm text-gray-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;
