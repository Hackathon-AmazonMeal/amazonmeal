import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (ingredient) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === ingredient.name);
      if (existing) {
        return prev.map(item =>
          item.name === ingredient.name
            ? { ...item, quantity: item.quantity + ingredient.quantity }
            : item
        );
      }
      return [...prev, { ...ingredient, id: Date.now() }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal,
      itemCount: cartItems.length 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);