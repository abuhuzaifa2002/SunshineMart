import { useCallback, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  availability: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export function useQuickView() {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const openQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
    setQuantity(1);
    // Check if product is in wishlist (you can implement this logic)
    setIsWishlisted(false);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setIsAddedToCart(false);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }, []);

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsWishlisted(!isWishlisted);
      // Add your wishlist logic here
    },
    [isWishlisted]
  );

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!selectedProduct) return;

      setIsAddingToCart(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Add to cart logic
        const cartItem = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          quantity,
        };

        // Get existing cart from localStorage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if item already exists in cart
        const existingItemIndex = existingCart.findIndex(
          (item: CartItem) => item.id === selectedProduct.id
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          existingCart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          existingCart.push(cartItem);
        }

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(existingCart));

        setIsAddedToCart(true);

        // Reset after 1.5 seconds
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 1500);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [selectedProduct, quantity]
  );

  const handleBuyNow = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      // Add to cart first
      await handleAddToCart(e);

      // Close modal and redirect to checkout
      closeQuickView();
      window.location.href = '/cart';
    },
    [handleAddToCart, closeQuickView]
  );

  return {
    isQuickViewOpen,
    selectedProduct,
    quantity,
    isWishlisted,
    isAddingToCart,
    isAddedToCart,
    openQuickView,
    closeQuickView,
    handleQuantityChange,
    handleWishlistToggle,
    handleAddToCart,
    handleBuyNow,
  };
}
