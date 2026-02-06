/**
 * @ai-context Centralized API endpoint constants.
 *             All backend API URLs MUST be defined here.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Products endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug: string) => `/products/${slug}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    BY_CATEGORY: (categorySlug: string) => `/categories/${categorySlug}/products`,
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug: string) => `/categories/${slug}`,
    TREE: '/categories/tree',
  },

  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart',
    APPLY_COUPON: '/cart/coupons',
    REMOVE_COUPON: (couponCode: string) => `/cart/coupons/${couponCode}`,
  },

  // Checkout endpoints
  CHECKOUT: {
    PROCESS: '/checkout',
    VALIDATE: '/checkout/validate',
    SHIPPING_QUOTE: '/shipping/quote',
    PAYMENT_PREFERENCE: '/checkout/payment-preference',
  },

  // Orders endpoints
  ORDERS: {
    LIST: '/customer/orders',
    DETAIL: (id: string) => `/customer/orders/${id}`,
    CANCEL: (id: string) => `/customer/orders/${id}/cancel`,
    TRACK: (trackingNumber: string) => `/shipping/track/${trackingNumber}`,
  },

  // User/Account endpoints
  USER: {
    PROFILE: '/customer/profile',
    UPDATE_PROFILE: '/customer/profile',
    ADDRESSES: '/customer/addresses',
    ADDRESS_CREATE: '/customer/addresses',
    ADDRESS_UPDATE: (id: string) => `/customer/addresses/${id}`,
    ADDRESS_DELETE: (id: string) => `/customer/addresses/${id}`,
  },

  // Webhooks (for reference)
  WEBHOOKS: {
    MERCADO_PAGO: '/webhooks/mercadopago',
    ANDREANI: '/webhooks/andreani',
  },
} as const;
