/**
 * @ai-context Cart-related types for the ecommerce frontend.
 */

import type { Product, ProductVariant } from '@/features/products';

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image?: string;
  stock: number;
}

export interface CartItem {
  id: string;
  product_id: number;
  product: CartProduct;
  variant_id?: number;
  variant?: ProductVariant;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  coupon?: AppliedCoupon;
  totals: CartTotals;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartData {
  product_id: number;
  variant_id?: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  totals: CartTotals;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextType extends CartState {
  addItem: (data: AddToCartData) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  itemCount: number;
}

export interface CartResponse {
  data: Cart;
}
