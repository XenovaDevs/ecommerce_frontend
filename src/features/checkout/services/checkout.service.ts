import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type {
  ShippingAddress,
  ShippingOption,
  PaymentMethod,
  MercadoPagoPreference,
  CheckoutData,
  Order,
  OrdersResponse,
  OrderResponse,
} from '../types';

/**
 * @ai-context Checkout API service for shipping, payment, and order processing.
 */

class CheckoutService {
  /**
   * Validate cart before checkout
   */
  async validateCart(): Promise<{ valid: boolean; errors?: string[] }> {
    const response = await apiClient.post<{ valid: boolean; errors?: string[] }>(
      API_ENDPOINTS.CHECKOUT.VALIDATE
    );
    return response.data;
  }

  /**
   * Get shipping quote based on address
   */
  async getShippingQuote(address: ShippingAddress): Promise<ShippingOption[]> {
    const response = await apiClient.post<{ data: ShippingOption[] }>(
      API_ENDPOINTS.CHECKOUT.SHIPPING_QUOTE,
      {
        postal_code: address.postal_code,
        city: address.city,
        state: address.state,
      }
    );
    return response.data.data;
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<{ data: PaymentMethod[] }>(
      `${API_ENDPOINTS.CHECKOUT.PROCESS.replace('/process', '')}/payment-methods`
    );
    return response.data.data;
  }

  /**
   * Create Mercado Pago preference for payment
   */
  async createPaymentPreference(orderId: number): Promise<MercadoPagoPreference> {
    const response = await apiClient.post<{ data: MercadoPagoPreference }>(
      `${API_ENDPOINTS.ORDERS.LIST}/${orderId}/payment-preference`
    );
    return response.data.data;
  }

  /**
   * Process checkout and create order
   */
  async processCheckout(data: CheckoutData): Promise<Order> {
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.CHECKOUT.PROCESS,
      data
    );
    return response.data.data;
  }

  /**
   * Get user's orders
   */
  async getOrders(page = 1, perPage = 10): Promise<OrdersResponse> {
    const response = await apiClient.get<OrdersResponse>(
      `${API_ENDPOINTS.ORDERS.LIST}?page=${page}&per_page=${perPage}`
    );
    return response.data;
  }

  /**
   * Get single order by ID
   */
  async getOrder(id: string | number): Promise<Order> {
    const response = await apiClient.get<OrderResponse>(
      API_ENDPOINTS.ORDERS.DETAIL(String(id))
    );
    return response.data.data;
  }

  /**
   * Get single order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<OrderResponse>(
      `${API_ENDPOINTS.ORDERS.LIST}/number/${orderNumber}`
    );
    return response.data.data;
  }

  /**
   * Cancel order (if allowed)
   */
  async cancelOrder(orderId: number): Promise<Order> {
    const response = await apiClient.post<OrderResponse>(
      API_ENDPOINTS.ORDERS.CANCEL(String(orderId))
    );
    return response.data.data;
  }

  /**
   * Save shipping address
   */
  async saveAddress(address: ShippingAddress): Promise<ShippingAddress> {
    const response = await apiClient.post<{ data: ShippingAddress }>(
      API_ENDPOINTS.USER.ADDRESSES,
      address
    );
    return response.data.data;
  }

  /**
   * Get saved addresses
   */
  async getAddresses(): Promise<ShippingAddress[]> {
    const response = await apiClient.get<{ data: ShippingAddress[] }>(
      API_ENDPOINTS.USER.ADDRESSES
    );
    return response.data.data;
  }

  /**
   * Delete saved address
   */
  async deleteAddress(addressId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USER.ADDRESS_DELETE(String(addressId)));
  }
}

export const checkoutService = new CheckoutService();
