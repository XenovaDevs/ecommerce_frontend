/**
 * @ai-context Centralized error messages for the entire frontend application.
 *             All user-facing error strings MUST be defined here.
 */

export const ErrorMessages = {
  NETWORK: {
    OFFLINE: 'Parece que estás sin conexión. Por favor, verifica tu conexión a internet.',
    TIMEOUT: 'La solicitud tardó demasiado. Por favor, intenta de nuevo.',
    SERVER: 'Algo salió mal. Por favor, intenta más tarde.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    FORBIDDEN: 'No tienes permiso para acceder a este recurso.',
  },

  AUTH: {
    SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
    EMAIL_EXISTS: 'Ya existe una cuenta con este email.',
    WEAK_PASSWORD: 'La contraseña es muy débil.',
    LOGIN_REQUIRED: 'Debes iniciar sesión para continuar.',
  },

  FORM: {
    REQUIRED: (field: string) => `${field} es requerido`,
    INVALID_EMAIL: 'Por favor, ingresa un email válido.',
    PASSWORD_MIN: 'La contraseña debe tener al menos 8 caracteres.',
    PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
    INVALID_PHONE: 'Por favor, ingresa un número de teléfono válido.',
    INVALID_POSTAL_CODE: 'Por favor, ingresa un código postal válido.',
  },

  CART: {
    EMPTY: 'Tu carrito está vacío.',
    ITEM_NOT_FOUND: 'El producto no fue encontrado en tu carrito.',
    STOCK_EXCEEDED: 'No hay suficiente stock disponible.',
    UPDATE_FAILED: 'No se pudo actualizar el carrito.',
    INVALID_COUPON: 'El cupón ingresado no es válido.',
    COUPON_EXPIRED: 'El cupón ha expirado.',
  },

  CHECKOUT: {
    ADDRESS_REQUIRED: 'Por favor, selecciona una dirección de envío.',
    SHIPPING_REQUIRED: 'Por favor, selecciona un método de envío.',
    PAYMENT_FAILED: 'El pago no pudo ser procesado. Por favor, intenta con otro método.',
    ORDER_FAILED: 'No se pudo crear la orden. Por favor, intenta de nuevo.',
  },

  PRODUCT: {
    NOT_FOUND: 'El producto no fue encontrado.',
    OUT_OF_STOCK: 'Este producto no tiene stock disponible.',
    VARIANT_REQUIRED: 'Por favor, selecciona una variante.',
  },

  GENERAL: {
    UNKNOWN: 'Ha ocurrido un error inesperado.',
    TRY_AGAIN: 'Por favor, intenta de nuevo.',
    CONTACT_SUPPORT: 'Si el problema persiste, contacta a soporte.',
  },
} as const;
