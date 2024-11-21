// src/contexts/CartContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { createCart } from '@/lib/shopify';

const CartContext = createContext<{
  cartId: string | null;
  setCartId: (id: string) => void;
}>({
  cartId: null,
  setCartId: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const initializeCart = async () => {
      const cart = await createCart();
      setCartId(cart.id);
    };

    if (!cartId) {
      initializeCart();
    }
  }, [cartId]);

  return (
    <CartContext.Provider value={{ cartId, setCartId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);