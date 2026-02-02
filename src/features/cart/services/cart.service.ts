import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type { Cart, AddToCartData, UpdateCartItemData, CartResponse, AppliedCoupon } from '../types';

/**
 * @ai-context Cart API service for managing shopping cart.
 */

class CartService {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET);
    return response.data.data;
  }

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartData): Promise<Cart> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.ADD_ITEM,
      data
    );
    return response.data.data;
  }

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    const response = await apiClient.put<CartResponse>(
      API_ENDPOINTS.CART.UPDATE_ITEM(itemId),
      data
    );
    return response.data.data;
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.CART.REMOVE_ITEM(itemId)
    );
    return response.data.data;
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
  }

  /**
   * Apply coupon code
   */
  async applyCoupon(code: string): Promise<Cart> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.APPLY_COUPON,
      { code }
    );
    return response.data.data;
  }

  /**
   * Remove applied coupon
   */
  async removeCoupon(): Promise<Cart> {
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.CART.REMOVE_COUPON
    );
    return response.data.data;
  }

  /**
   * Merge anonymous cart with user cart after login
   */
  async mergeCart(anonymousCartId: string): Promise<Cart> {
    const response = await apiClient.post<CartResponse>(
      `${API_ENDPOINTS.CART.GET}/merge`,
      { anonymous_cart_id: anonymousCartId }
    );
    return response.data.data;
  }
}

export const cartService = new CartService();
