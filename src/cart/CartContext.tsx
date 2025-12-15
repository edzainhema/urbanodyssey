import React, { createContext, useContext, useEffect, useState } from "react";

/* ----------------------------
   Types
----------------------------- */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  size?: string | null;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string | null) => void;
  clearCart: () => void;
};

/* ----------------------------
   Context
----------------------------- */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* ----------------------------
   Provider
----------------------------- */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, size?: string | null) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ----------------------------
   Hook
----------------------------- */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
