'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import PdfGenerator from './PdfGenerator';

export default function OrderConfirmationModal({ order, onClose }) {
  const router = useRouter();
  const pdfGeneratorRef = useRef<{ generatePdf: () => void }>(null);

  const handleDownloadPayslip = () => {
    if (pdfGeneratorRef.current) {
      pdfGeneratorRef.current.generatePdf();
    }
  };

  const handleContinueShopping = () => {
    onClose();
    router.push('/');
  };

  if (!order) {
    return null;
  }

  const userData = {
    firstName: order.user.name.split(' ')[0],
    lastName: order.user.name.split(' ')[1] || '',
    email: order.user.email,
    phone: '', // Not available in order object
    address: order.shippingAddress,
    city: '', // Not available in order object
    district: '', // Not available in order object
    zipCode: '', // Not available in order object
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Order Placed Successfully!</h2>
        <p className="text-gray-700 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-700 mb-6">Your order ID is: <span className="font-semibold">{order._id}</span></p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={handleDownloadPayslip} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
          >
            Download Payslip
          </button>
          <button 
            onClick={handleContinueShopping} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <PdfGenerator 
          ref={pdfGeneratorRef} 
          cartItems={order.items} 
          userData={userData} 
          deliveryCharge={order.shippingPrice} // Assuming shippingPrice is on the order object
          totalAmount={order.totalAmount} 
        />
      </div>
    </div>
  );
}