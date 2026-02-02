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
  CartItem,
  AppliedCoupon,
  CartTotals,
  AddToCartData,
  CartContextType,
} from '../types';

/**
 * @ai-context Cart context provider for global cart state management.
 * @ai-flow
 *   1. On mount, fetches cart from API (or localStorage for anonymous)
 *   2. Provides methods to add, update, remove items
 *   3. Syncs with backend on every mutation
 *   4. Calculates totals locally for optimistic UI
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

  // Calculate item count
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  // Calculate totals locally for optimistic updates
  const calculateTotals = useCallback(
    (cartItems: CartItem[], appliedCoupon: AppliedCoupon | null): CartTotals => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.discount_type === 'percentage') {
          discount = subtotal * (appliedCoupon.discount_value / 100);
        } else {
          discount = appliedCoupon.discount_value;
        }
      }

      const total = subtotal - discount;

      return { subtotal, discount, tax: 0, total };
    },
    []
  );

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await cartService.getCart();
        setItems(cart.items);
        setCoupon(cart.coupon || null);
        setTotals(cart.totals);
      } catch (err) {
        // Cart might not exist yet, that's OK
        console.error('Failed to fetch cart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Add item to cart
  const addItem = useCallback(
    async (data: AddToCartData) => {
      setIsLoading(true);
      setError(null);

      try {
        const cart = await cartService.addItem(data);
        setItems(cart.items);
        setTotals(cart.totals);
        if (cart.coupon) setCoupon(cart.coupon);
      } catch (err) {
        setError('Error al agregar al carrito');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update item quantity
  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

      try {
        const cart = await cartService.updateItem(itemId, { quantity });
        setItems(cart.items);
        setTotals(cart.totals);
      } catch (err) {
        // Revert on error
        const cart = await cartService.getCart();
        setItems(cart.items);
        setTotals(cart.totals);
        setError('Error al actualizar cantidad');
        throw err;
      }
    },
    []
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (itemId: string) => {
      // Optimistic update
      const previousItems = items;
      setItems((prev) => prev.filter((item) => item.id !== itemId));

      try {
        const cart = await cartService.removeItem(itemId);
        setItems(cart.items);
        setTotals(cart.totals);
      } catch (err) {
        // Revert on error
        setItems(previousItems);
        setError('Error al eliminar del carrito');
        throw err;
      }
    },
    [items]
  );

  // Clear cart
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

  // Apply coupon
  const applyCoupon = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const cart = await cartService.applyCoupon(code);
      setCoupon(cart.coupon || null);
      setTotals(cart.totals);
    } catch (err) {
      setError('Cupón inválido o expirado');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    try {
      const cart = await cartService.removeCoupon();
      setCoupon(null);
      setTotals(cart.totals);
    } catch (err) {
      setError('Error al remover cupón');
      throw err;
    }
  }, []);

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
