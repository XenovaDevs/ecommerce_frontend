'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { cartService } from '../services';
import type {
  Cart,
  CartItem,
  AppliedCoupon,
  CartTotals,
  AddToCartData,
  CartContextType,
} from '../types';

/**
 * @ai-context Cart context provider for global cart state management.
 */

const EMPTY_TOTALS: CartTotals = {
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [totals, setTotals] = useState<CartTotals>(EMPTY_TOTALS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const syncCartState = useCallback((cart: Cart) => {
    setItems(cart.items);
    setCoupon(cart.coupon || null);
    setTotals(cart.totals);
  }, []);

  const refreshCart = useCallback(async () => {
    const cart = await cartService.getCart();
    syncCartState(cart);
    return cart;
  }, [syncCartState]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await refreshCart();
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (data: AddToCartData) => {
      setIsLoading(true);
      setError(null);

      try {
        await cartService.addItem(data);
        await refreshCart();
      } catch (err) {
        setError('Error al agregar al carrito');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCart]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );

      try {
        await cartService.updateItem(itemId, { quantity });
        await refreshCart();
      } catch (err) {
        await refreshCart();
        setError('Error al actualizar cantidad');
        throw err;
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      const previousItems = items;
      setItems((prev) => prev.filter((item) => item.id !== itemId));

      try {
        await cartService.removeItem(itemId);
        await refreshCart();
      } catch (err) {
        setItems(previousItems);
        await refreshCart();
        setError('Error al eliminar del carrito');
        throw err;
      }
    },
    [items, refreshCart]
  );

  const clearCart = useCallback(async () => {
    setIsLoading(true);

    try {
      await cartService.clearCart();
      setItems([]);
      setCoupon(null);
      setTotals(EMPTY_TOTALS);
    } catch (err) {
      setError('Error al vaciar carrito');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyCoupon = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const cart = await cartService.applyCoupon(code);
        syncCartState(cart);
      } catch (err) {
        setError('Cupón inválido o expirado');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [syncCartState]
  );

  const removeCoupon = useCallback(
    async () => {
      if (!coupon) return;

      try {
        const cart = await cartService.removeCoupon(coupon.code);
        syncCartState(cart);
      } catch (err) {
        setError('Error al remover cupón');
        throw err;
      }
    },
    [coupon, syncCartState]
  );

  const value: CartContextType = {
    items,
    coupon,
    totals,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
