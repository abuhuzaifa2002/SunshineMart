'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import PdfGenerator from '@/components/PdfGenerator';

// Define the UserData interface to match what PdfGenerator expects
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  zipCode?: string;
}

export default function PaymentPage() {
  const { cartItems, getCartTotal } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState<UserData | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Retrieve data from local storage
    const storedShippingInfo = localStorage.getItem('shippingInfo');
    const storedDeliveryCharge = localStorage.getItem('deliveryCharge');
    const storedTotalAmount = localStorage.getItem('totalAmount');

    setShippingInfo(storedShippingInfo ? JSON.parse(storedShippingInfo) : null);
    setDeliveryCharge(storedDeliveryCharge ? parseFloat(JSON.parse(storedDeliveryCharge)) : 0); // Use parseFloat
    setTotalAmount(storedTotalAmount ? parseFloat(JSON.parse(storedTotalAmount)) : 0); // Use parseFloat
  }, []);

  if (cartItems.length === 0 || !shippingInfo) {
    return (
      <main className="min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No items in cart or shipping info missing.</h1>
        <p className="text-gray-600 mb-8">Please add items to your cart and proceed to checkout.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Complete Your Payment</h1>

        {/* Order Summary */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-blue-800 mb-5 border-b pb-3">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center border-b border-blue-100 pb-4 last:border-b-0">
                <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden mr-5 border border-gray-200">
                  <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-800 text-lg">৳{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-5 mt-5 border-t border-blue-200">
            <span className="text-xl font-bold text-gray-900">Subtotal:</span>
            <span className="text-xl font-bold text-gray-900">৳{getCartTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-medium text-gray-800">Delivery Charge:</span>
            <span className="text-lg font-semibold text-gray-800">৳{deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-4 p-3 bg-blue-100 rounded-md">
            <span className="text-2xl font-extrabold text-blue-900">Total Amount:</span>
            <span className="text-2xl font-extrabold text-blue-900">৳{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">Choose Payment Method</h2>

          {/* Cash on Delivery */}
          <div className="bg-gray-50 p-5 rounded-lg mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="paymentMethod" value="cod" className="form-radio h-6 w-6 text-orange-600 border-gray-300 focus:ring-orange-500" defaultChecked />
              <span className="ml-4 text-xl font-semibold text-gray-800">Cash on Delivery</span>
            </label>
            <p className="text-gray-600 ml-10 text-sm mt-1">Pay with cash upon delivery of your order.</p>
          </div>

          {/* Mobile Banking (bKash, Nagad, Rocket) */}
          <div className="bg-gray-50 p-5 rounded-lg mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="paymentMethod" value="mobileBanking" className="form-radio h-6 w-6 text-orange-600 border-gray-300 focus:ring-orange-500" />
              <span className="ml-4 text-xl font-semibold text-gray-800">Mobile Banking</span>
            </label>
            <div className="flex items-center ml-10 mt-3 space-x-5">
              <Image src="/assets/bkash.jpg" alt="bKash" width={80} height={30} className="object-contain" />
              <Image src="/assets/nagad.png" alt="Nagad" width={80} height={30} className="object-contain" />
              <Image src="/assets/rocket.png" alt="Rocket" width={80} height={30} className="object-contain" />
            </div>
            <p className="text-gray-600 ml-10 text-sm mt-2">Pay securely using bKash, Nagad, or Rocket.</p>
          </div>

          {/* Debit/Credit Card */}
          <div className="bg-gray-50 p-5 rounded-lg mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="paymentMethod" value="card" className="form-radio h-6 w-6 text-orange-600 border-gray-300 focus:ring-orange-500" />
              <span className="ml-4 text-xl font-semibold text-gray-800">Debit / Credit Card</span>
            </label>
            <div className="ml-10 mt-3">
              <div className="bg-white p-5 rounded-md border border-gray-300 shadow-sm">
                <p className="text-gray-700 font-medium mb-3">Enter Card Details:</p>
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="sr-only">Card Number</label>
                  <input type="text" id="cardNumber" placeholder="Card Number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-3 text-lg" />
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="expiryDate" className="sr-only">Expiry Date</label>
                    <input type="text" id="expiryDate" placeholder="MM/YY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-3 text-lg" />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="cvc" className="sr-only">CVC</label>
                    <input type="text" id="cvc" placeholder="CVC" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-3 text-lg" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="cardName" className="sr-only">Name on Card</label>
                  <input type="text" id="cardName" placeholder="Name on Card" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-3 text-lg" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 ml-10 text-sm mt-2">Securely pay with your debit or credit card.</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => alert('Proceeding with payment... (Not implemented yet)')}
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-xl shadow-md mr-4"
          >
            Confirm Payment
          </button>
          {shippingInfo && (
            <PdfGenerator
              cartItems={cartItems}
              userData={shippingInfo}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
            />
          )}
        </div>
      </div>
    </main>
  );
}