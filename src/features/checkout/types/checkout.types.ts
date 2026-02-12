/**
 * @ai-context Checkout-related types for the ecommerce frontend.
 *             Types aligned with backend API responses.
 */

export type CheckoutStep = 'shipping' | 'payment' | 'review';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

// Backend address format (OrderAddressResource)
export interface OrderAddress {
  id?: number;
  type?: string;
  name: string;
  phone?: string;
  address: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  full_address?: string;
}

// Frontend form address (used in ShippingStep form)
export interface ShippingAddressForm {
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
  type: string;
  name: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
}

export interface MercadoPagoPreference {
  payment_id: number;
  preference_id: string;
  init_point: string;
  sandbox_init_point: string;
}

// Data sent to backend for checkout
export interface CheckoutData {
  shipping_address: OrderAddress;
  billing_address?: OrderAddress;
  shipping_cost: number;
  payment_method: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  variant_id?: number;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  total: number;
  options?: Record<string, string>;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  item_count?: number;
  notes?: string;
  tracking_number?: string;
  items: OrderItem[];
  shipping_address?: OrderAddress;
  billing_address?: OrderAddress;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

// Response from POST /checkout
export interface CheckoutResponse {
  order: Order;
  payment_url: string | null;
}

export interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddressForm | null;
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}

export interface CheckoutContextType extends CheckoutState {
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddressForm) => void;
  setShippingOption: (option: ShippingOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  fetchShippingOptions: (address: ShippingAddressForm) => Promise<void>;
  processCheckout: () => Promise<Order>;
  reset: () => void;
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
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

// Helper to convert frontend form address to backend address format
export function formAddressToBackend(form: ShippingAddressForm): OrderAddress {
  return {
    name: `${form.first_name} ${form.last_name}`.trim(),
    phone: form.phone,
    address: `${form.street} ${form.number}`.trim(),
    address_line_2: form.apartment || undefined,
    city: form.city,
    state: form.state,
    postal_code: form.postal_code,
    country: form.country,
  };
}
