import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type { Cart, AddToCartData, UpdateCartItemData, CartResponse, AppliedCoupon } from '../types';

/**
 * @ai-context Cart API service for managing shopping cart.
 */

class CartService {
  private asObject(value: unknown): Record<string, unknown> {
    if (value && typeof value === 'object') {
      return value as Record<string, unknown>;
    }

    return {};
  }

  private normalizeCoupon(coupon: Record<string, unknown> | null | undefined): AppliedCoupon | undefined {
    if (!coupon) return undefined;

    const discountType = coupon.type === 'percentage' || coupon.discount_type === 'percentage'
      ? 'percentage'
      : 'fixed';
    const discountValue = Number(coupon.value ?? coupon.discount_value ?? 0);
    const discountAmount = Number(coupon.discount_amount ?? 0);

    return {
      code: String(coupon.code ?? ''),
      discount_type: discountType,
      discount_value: Number.isFinite(discountValue) ? discountValue : 0,
      discount_amount: Number.isFinite(discountAmount) ? discountAmount : 0,
    };
  }

  private normalizeCart(raw: Record<string, unknown> | undefined): Cart {
    const source = raw ?? {};
    const sourceTotals = this.asObject(source.totals);
    const items = Array.isArray(source.items) ? source.items : [];
    const coupons = Array.isArray(source.coupons) ? source.coupons : [];
    const normalizedCoupon = coupons.length > 0 ? this.normalizeCoupon(this.asObject(coupons[0])) : undefined;
    const subtotal = Number(source.subtotal ?? sourceTotals.subtotal ?? 0);
    const discount = Number(source.discount ?? sourceTotals.discount ?? 0);
    const tax = Number(source.tax ?? sourceTotals.tax ?? 0);
    const total = Number(source.total ?? sourceTotals.total ?? subtotal - discount + tax);

    return {
      id: String(source.id ?? ''),
      items: items.map((rawItem) => {
        const item = this.asObject(rawItem);
        const product = this.asObject(item.product);
        const productImages = Array.isArray(product.images) ? product.images : [];
        const productPrice = Number(product.current_price ?? product.price ?? item.price ?? 0);
        const primaryImage = this.asObject(product.primary_image);
        const firstImage = this.asObject(productImages[0]);
        const imageCandidate =
          primaryImage.url
          ?? firstImage.url
          ?? product.image
          ?? item.image;

        return {
          id: String(item.id ?? ''),
          product_id: Number(item.product_id ?? product.id ?? 0),
          product: {
            id: Number(product.id ?? item.product_id ?? 0),
            name: String(product.name ?? ''),
            slug: String(product.slug ?? ''),
            price: Number.isFinite(productPrice) ? productPrice : 0,
            image: typeof imageCandidate === 'string' ? imageCandidate : undefined,
            stock: Number(product.stock ?? item.available_stock ?? 0),
          },
          variant_id: item.variant_id ? Number(item.variant_id) : undefined,
          variant: undefined,
          quantity: Number(item.quantity ?? 0),
        };
      }),
      coupon: normalizedCoupon,
      totals: {
        subtotal: Number.isFinite(subtotal) ? subtotal : 0,
        discount: Number.isFinite(discount) ? discount : 0,
        tax: Number.isFinite(tax) ? tax : 0,
        total: Number.isFinite(total) ? total : 0,
      },
      item_count: Number(source.item_count ?? 0),
      created_at: String(source.created_at ?? ''),
      updated_at: String(source.updated_at ?? ''),
    };
  }

  private extractCartPayload(responseData: unknown): Record<string, unknown> {
    const root = this.asObject(responseData);
    const data = this.asObject(root.data ?? root);
    const nestedCart = this.asObject(data.cart);

    if (Object.keys(nestedCart).length > 0) {
      return nestedCart;
    }

    return data;
  }

  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET);
    return this.normalizeCart(this.extractCartPayload(response.data));
  }

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartData): Promise<Cart> {
    const response = await apiClient.post<CartResponse>(
      API_ENDPOINTS.CART.ADD_ITEM,
      data
    );
    return this.normalizeCart(this.extractCartPayload(response.data));
  }

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    const response = await apiClient.patch<CartResponse>(
      API_ENDPOINTS.CART.UPDATE_ITEM(itemId),
      data
    );
    return this.normalizeCart(this.extractCartPayload(response.data));
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(itemId));
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
    return this.normalizeCart(this.extractCartPayload(response.data));
  }

  /**
   * Remove applied coupon
   */
  async removeCoupon(couponCode: string): Promise<Cart> {
    const response = await apiClient.delete<CartResponse>(
      API_ENDPOINTS.CART.REMOVE_COUPON(couponCode)
    );
    return this.normalizeCart(this.extractCartPayload(response.data));
  }

  /**
   * Merge anonymous cart with user cart after login
   */
  async mergeCart(anonymousCartId: string): Promise<Cart> {
    const response = await apiClient.post<CartResponse>(
      `${API_ENDPOINTS.CART.GET}/merge`,
      { anonymous_cart_id: anonymousCartId }
    );
    return this.normalizeCart(this.extractCartPayload(response.data));
  }
}

export const cartService = new CartService();
