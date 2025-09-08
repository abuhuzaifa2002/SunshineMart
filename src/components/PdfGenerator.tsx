'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CartItem } from '../context/CartContext';

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

interface PdfGeneratorProps {
  cartItems: CartItem[];
  userData: UserData | null;
  deliveryCharge: number;
  totalAmount: number;
}

const PdfGenerator = forwardRef<{
  generatePdf: () => void;
}, PdfGeneratorProps>(({ cartItems, userData, deliveryCharge = 0, totalAmount = 0 }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePdf = async () => {
    if (!contentRef.current) return;

    const input = contentRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('payslip.pdf');
  };

  useImperativeHandle(ref, () => ({
    generatePdf,
  }));

  return (
    <div>
      <div ref={contentRef} className="p-8 bg-white font-sans text-gray-800" style={{ position: 'absolute', left: '-9999px', width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div className="bg-gradient-to-r from-gray-900 via-red-900  to-gray-900 text-white p-8 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">INVOICE</h1>
              <p className="text-sm">Invoice #12345</p>
            </div>
            <div className="text-right">
              <h2 className="gradient-text font-display text-orange-600 text-2xl font-bold transition-all duration-500 ease-out group-hover:scale-105 group-hover:tracking-wide">☀️ Sunshine </h2>
              <p className="text-xs mt-1">Elevate Your Style With Sunshine </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Billed To:</h3>
              {userData && (
                <div className="text-sm">
                  <p><strong>{userData.firstName} {userData.lastName}</strong></p>
                  <p>{userData.address}</p>
                  <p>{userData.city}, {userData.district} {userData.zipCode}</p>
                  <p>{userData.email}</p>
                  <p>{userData.phone}</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold mb-2">Payment Details:</h3>
              <p className="text-sm"><strong>Payment Method:</strong> Cash on Delivery</p>
              <p className="text-sm"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left font-semibold">Product</th>
                  <th className="p-3 text-left font-semibold">Size</th>
                  <th className="p-3 text-center font-semibold">Quantity</th>
                  <th className="p-3 text-right font-semibold">Price</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.size}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">৳{item.price.toFixed(2)}</td>
                    <td className="p-3 text-right">৳{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-1/2">
              <div className="flex justify-between text-sm mb-2">
                <p>Subtotal:</p>
                <p>৳{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <p>Delivery Charge:</p>
                <p>৳{deliveryCharge.toFixed(2)}</p>
              </div>
              <div className="border-t-2 border-gray-300 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <p>Grand Total:</p>
                <p>৳{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
            <p>Sunshine | 123 Fashion St, Dhaka, Bangladesh | contact@sunshine.com</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PdfGenerator;