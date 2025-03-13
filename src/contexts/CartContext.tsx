
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Explicitly define the CartItem type
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    console.log("Cart updated, current items:", cartItems.length);
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    // Check if item is already in cart
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: newCartItems[existingItemIndex].quantity + 1,
      };
      setCartItems(newCartItems);
      toast.success(`Menge von ${item.name} wurde erhöht`);
    } else {
      // Item doesn't exist, add it
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
      toast.success(`${item.name} wurde zum Warenkorb hinzugefügt`);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems((items) => items.filter((item) => item.id !== id));
    if (itemToRemove) {
      toast.info(`${itemToRemove.name} wurde aus dem Warenkorb entfernt`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Warenkorb wurde geleert");
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
