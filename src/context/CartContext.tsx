'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios'; // Import axios

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log('Fetching cart with token:', token);
          const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Cart fetch successful. Response data:', response.data);
          setCartItems(response.data.items || []);
        } catch (error) {
          console.error('Error fetching cart:', error.response ? error.response.data : error.message);
          // Handle error, e.g., clear local cart or show a message
        }
      } else {
        setCartItems([]); // Clear cart if no token
      }
    };
    fetchCart();
  }, []); // Empty dependency array means this runs once on mount

  

  const addToCart = async (item: CartItem) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User not logged in.');
      return;
    }

    try {
      console.log('Attempting to add to cart:', item);
      console.log('Using token:', token);
      const response = await axios.post('http://localhost:5000/api/cart', item, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Add to cart successful. Response:', response.data);
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User not logged in.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/${productId}/${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User not logged in.');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/cart/quantity', { productId, size, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
