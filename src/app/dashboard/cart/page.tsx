'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CartDisplay from '../../../components/CartDisplay';
import PdfGenerator from '../../../components/PdfGenerator'; // Import PdfGenerator
import { useCart } from '../../../context/CartContext'; // Import useCart
import Toast from '../../../components/Toast'; // Import Toast component

interface UserData {
  name: string;
  email: string;
}

export default function CartPage() {
  const { cartItems } = useCart(); // Use useCart hook
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null); // State for toast

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData({ name: res.data.name, email: res.data.email });
        } catch (error) {
          console.error('Error fetching user data for PDF:', error);
          // Handle error, e.g., clear token or show message
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Your Cart</h2>
      <CartDisplay setShowToast={setShowToast} /> {/* Pass setShowToast to CartDisplay */}
      <div className="mt-8">
        <PdfGenerator cartItems={cartItems} userData={userData} />
      </div>

      

      {showToast && ( // Render Toast component
        <Toast
          message={showToast.message}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
}