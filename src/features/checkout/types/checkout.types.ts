/**
 * @ai-context Checkout-related types for the ecommerce frontend.
 */

export type CheckoutStep = 'shipping' | 'payment' | 'review';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ShippingAddress {
  id?: number;
  first_name: string;
  last_name: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default?: boolean;
}

export interface ShippingOption {
  id: string;
  provider: string;
  name: string;
  price: number;
  estimated_days: number;
  estimated_delivery: string;
}

export interface PaymentMethod {
  id: string;
  type: 'mercadopago' | 'bank_transfer' | 'cash';
  name: string;
  description?: string;
  icon?: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface CheckoutData {
  shipping_address: ShippingAddress;
  shipping_option_id: string;
  payment_method_id: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  variant_id?: number;
  variant_name?: string;
  sku?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddress;
  shipping_option: ShippingOption;
  items: OrderItem[];
  totals: OrderTotals;
  notes?: string;
  tracking_number?: string;
  payment_id?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}

export interface CheckoutContextType extends CheckoutState {
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingOption: (option: ShippingOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  fetchShippingOptions: (address: ShippingAddress) => Promise<void>;
  processCheckout: () => Promise<Order>;
  reset: () => void;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

export interface OrderResponse {
  data: Order;
}
