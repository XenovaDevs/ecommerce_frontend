/**
 * @ai-context Centralized route constants for the entire application.
 *             All route paths MUST be defined here to ensure consistency.
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_FAILURE: '/checkout/failure',
  CHECKOUT_PENDING: '/checkout/pending',
  CONTACT: '/contact',

  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Account routes
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ADDRESSES: '/addresses',
  WISHLIST: '/wishlist',
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.CATEGORIES,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const PROTECTED_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.ORDERS,
  ROUTES.ADDRESSES,
  ROUTES.WISHLIST,
  ROUTES.CHECKOUT,
];
