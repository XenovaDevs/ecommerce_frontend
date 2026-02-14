import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type {
  ShippingAddressForm,
  ShippingOption,
  PaymentMethod,
  MercadoPagoPreference,
  CheckoutData,
  CheckoutResponse,
  Order,
  OrdersResponse,
  OrderResponse,
} from '../types';

/**
 * @ai-context Checkout API service for shipping, payment, and order processing.
 *             Endpoints aligned with backend routes.
 */

class CheckoutService {
  /**
   * Validate cart before checkout
   */
  async validateCart(isGuestCheckout = false): Promise<{ valid: boolean; errors?: string[] }> {
    const endpoint = isGuestCheckout
      ? API_ENDPOINTS.CHECKOUT.GUEST_VALIDATE
      : API_ENDPOINTS.CHECKOUT.VALIDATE;

    const response = await apiClient.post<{ data: { valid: boolean; message: string } }>(
      endpoint
    );
    return { valid: response.data.data.valid };
  }

  /**
   * Get shipping quote based on address
   */
  async getShippingQuote(address: ShippingAddressForm): Promise<ShippingOption[]> {
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
   * Backend route: GET /payments/methods
   */
  async getPaymentMethods(isGuestCheckout = false): Promise<PaymentMethod[]> {
    const endpoint = isGuestCheckout
      ? API_ENDPOINTS.CHECKOUT.GUEST_PAYMENT_METHODS
      : '/payments/methods';

    const response = await apiClient.get<{ data: PaymentMethod[] }>(
      endpoint
    );
    return response.data.data;
  }

  /**
   * Create Mercado Pago preference for an existing order
   * Backend route: POST /checkout/payment-preference
   */
  async createPaymentPreference(orderId: number): Promise<MercadoPagoPreference> {
    const response = await apiClient.post<{ data: MercadoPagoPreference }>(
      API_ENDPOINTS.CHECKOUT.PAYMENT_PREFERENCE,
      { order_id: orderId }
    );
    return response.data.data;
  }

  /**
   * Process checkout and create order
   * Backend route: POST /checkout
   * Returns { order, payment_url }
   */
  async processCheckout(data: CheckoutData, isGuestCheckout = false): Promise<CheckoutResponse> {
    const endpoint = isGuestCheckout
      ? API_ENDPOINTS.CHECKOUT.GUEST_PROCESS
      : API_ENDPOINTS.CHECKOUT.PROCESS;

    const response = await apiClient.post<{ data: CheckoutResponse }>(
      endpoint,
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
   * Backend route: GET /customer/orders/number/{orderNumber}
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
  async saveAddress(address: ShippingAddressForm): Promise<ShippingAddressForm> {
    const response = await apiClient.post<{ data: ShippingAddressForm }>(
      API_ENDPOINTS.USER.ADDRESSES,
      address
    );
    return response.data.data;
  }

  /**
   * Get saved addresses
   */
  async getAddresses(): Promise<ShippingAddressForm[]> {
    const response = await apiClient.get<{ data: ShippingAddressForm[] }>(
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
