/**
 * @ai-context UI text and labels used throughout the application.
 *             All UI strings MUST be defined here for i18n readiness.
 */

export const UIMessages = {
  // Common actions
  ACTIONS: {
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    CREATE: 'Crear',
    UPDATE: 'Actualizar',
    SUBMIT: 'Enviar',
    CONFIRM: 'Confirmar',
    BACK: 'Volver',
    NEXT: 'Siguiente',
    PREVIOUS: 'Anterior',
    CLOSE: 'Cerrar',
    SEARCH: 'Buscar',
    FILTER: 'Filtrar',
    CLEAR: 'Limpiar',
    RESET: 'Restablecer',
    RETRY: 'Reintentar',
    LOAD_MORE: 'Cargar más',
    VIEW_ALL: 'Ver todo',
    VIEW_DETAILS: 'Ver detalles',
  },

  // Auth
  AUTH: {
    LOGIN: 'Iniciar sesión',
    LOGOUT: 'Cerrar sesión',
    REGISTER: 'Crear cuenta',
    FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
    RESET_PASSWORD: 'Restablecer contraseña',
    EMAIL: 'Email',
    PASSWORD: 'Contraseña',
    CONFIRM_PASSWORD: 'Confirmar contraseña',
    REMEMBER_ME: 'Recordarme',
    NO_ACCOUNT: '¿No tienes cuenta?',
    HAS_ACCOUNT: '¿Ya tienes cuenta?',
    FIRST_NAME: 'Nombre',
    LAST_NAME: 'Apellido',
  },

  // Cart
  CART: {
    TITLE: 'Carrito de compras',
    EMPTY: 'Tu carrito está vacío',
    EMPTY_CTA: 'Explorar productos',
    ITEM: 'producto',
    ITEMS: 'productos',
    SUBTOTAL: 'Subtotal',
    SHIPPING: 'Envío',
    TAX: 'Impuestos',
    TOTAL: 'Total',
    CHECKOUT: 'Finalizar compra',
    CONTINUE_SHOPPING: 'Continuar comprando',
    REMOVE: 'Eliminar',
    UPDATE_QUANTITY: 'Actualizar cantidad',
    ADD_TO_CART: 'Agregar al carrito',
    ADDED_TO_CART: 'Agregado al carrito',
    FREE_SHIPPING: 'Envío gratis',
    FREE_SHIPPING_FROM: (amount: string) => `Envío gratis a partir de ${amount}`,
  },

  // Checkout
  CHECKOUT: {
    TITLE: 'Finalizar compra',
    SHIPPING_ADDRESS: 'Dirección de envío',
    BILLING_ADDRESS: 'Dirección de facturación',
    SHIPPING_METHOD: 'Método de envío',
    PAYMENT_METHOD: 'Método de pago',
    ORDER_SUMMARY: 'Resumen del pedido',
    PLACE_ORDER: 'Realizar pedido',
    PROCESSING: 'Procesando...',
    SUCCESS_TITLE: '¡Gracias por tu compra!',
    SUCCESS_MESSAGE: 'Tu pedido ha sido confirmado.',
    ORDER_NUMBER: 'Número de pedido',
  },

  // Products
  PRODUCTS: {
    ALL_PRODUCTS: 'Todos los productos',
    CATEGORIES: 'Categorías',
    FILTERS: 'Filtros',
    SORT_BY: 'Ordenar por',
    PRICE: 'Precio',
    PRICE_LOW_HIGH: 'Precio: menor a mayor',
    PRICE_HIGH_LOW: 'Precio: mayor a menor',
    NEWEST: 'Más recientes',
    BEST_SELLING: 'Más vendidos',
    OUT_OF_STOCK: 'Sin stock',
    IN_STOCK: 'En stock',
    ADD_TO_WISHLIST: 'Agregar a favoritos',
    REMOVE_FROM_WISHLIST: 'Quitar de favoritos',
    DESCRIPTION: 'Descripción',
    SPECIFICATIONS: 'Especificaciones',
    REVIEWS: 'Reseñas',
    RELATED_PRODUCTS: 'Productos relacionados',
    NO_RESULTS: 'No se encontraron productos',
    SHOWING: 'Mostrando',
    OF: 'de',
    RESULTS: 'resultados',
  },

  // Orders
  ORDERS: {
    MY_ORDERS: 'Mis pedidos',
    ORDER_HISTORY: 'Historial de pedidos',
    ORDER_DETAILS: 'Detalles del pedido',
    ORDER_STATUS: 'Estado del pedido',
    ORDER_DATE: 'Fecha del pedido',
    TRACK_ORDER: 'Seguir pedido',
    CANCEL_ORDER: 'Cancelar pedido',
    NO_ORDERS: 'No tienes pedidos aún',
    STATUS: {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      PROCESSING: 'En proceso',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
      REFUNDED: 'Reembolsado',
    },
  },

  // Account
  ACCOUNT: {
    MY_ACCOUNT: 'Mi cuenta',
    PROFILE: 'Perfil',
    ADDRESSES: 'Direcciones',
    WISHLIST: 'Favoritos',
    SETTINGS: 'Configuración',
  },

  // Common
  COMMON: {
    LOADING: 'Cargando...',
    ERROR: 'Error',
    SUCCESS: 'Éxito',
    WARNING: 'Advertencia',
    INFO: 'Información',
    YES: 'Sí',
    NO: 'No',
    OR: 'o',
    AND: 'y',
    ALL: 'Todos',
    NONE: 'Ninguno',
    SELECT: 'Seleccionar',
    SELECTED: 'Seleccionado',
    OPTIONAL: 'Opcional',
    REQUIRED: 'Requerido',
  },
} as const;
