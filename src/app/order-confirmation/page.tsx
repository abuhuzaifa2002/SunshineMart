"use client";

import Link from 'next/link';

export default function OrderConfirmationPage() {
  const handleDownloadPayslip = async () => {
    console.log('Attempting to download payslip...');
    const orderId = '60d5ec49f8c7b10015e8a1b2'; // Dummy order ID for now. In a real app, pass actual order ID.

    try {
      const response = await fetch(`/api/payslip/${orderId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      console.log('Payslip download initiated successfully.');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      alert('Failed to download payslip. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>
        <div className="flex flex-col space-y-4">
          <Link href="/orders/123" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              View Order Details
          </Link>
          <button
            onClick={handleDownloadPayslip}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Download Payslip
          </button>
        </div>
      </div>
    </div>
  );
}