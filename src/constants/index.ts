export * from './routes';
export * from './api';

/**
 * @ai-context Application-wide constants
 */
export const APP_CONFIG = {
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Ecommerce',
  SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Tu tienda online',
  CURRENCY: process.env.NEXT_PUBLIC_CURRENCY || 'ARS',
  LOCALE: process.env.NEXT_PUBLIC_LOCALE || 'es-AR',
  DEFAULT_PAGE_SIZE: 12,
  MAX_CART_QUANTITY: 99,
  FREE_SHIPPING_MIN: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_MIN) || 50000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CART_ID: 'cart_id',
  USER: 'user',
  THEME_PREFERENCE: 'lps-theme-preference',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  CART: 'cart',
  ORDERS: 'orders',
  ORDER: 'order',
  ADDRESSES: 'addresses',
} as const;
