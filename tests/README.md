# Tests E2E con Playwright - Le Pas Sage Ecommerce

## Descripción

Suite completa de tests end-to-end para el frontend del ecommerce usando Playwright. Los tests cubren los flujos principales de compra para clientes.

## Estructura de Tests

```
tests/
├── home.spec.ts              # Página de inicio y navegación básica
├── products.spec.ts          # Listado, filtros y categorías de productos
├── cart.spec.ts              # Carrito de compras
├── checkout-guest.spec.ts    # Checkout como invitado (sin registro)
├── checkout-registered.spec.ts # Checkout como usuario registrado
├── auth.spec.ts              # Login y registro
└── README.md                 # Este archivo
```

## Cobertura de Tests

### ✅ Home (home.spec.ts)
- Carga de página principal
- Features principales
- Navegación a productos y categorías
- Newsletter
- Productos destacados

### ✅ Productos (products.spec.ts)
- Listado de productos
- Filtros por categoría
- Filtros por precio
- Filtros por stock/ofertas
- Agregar productos al carrito
- Paginación (cargar más)
- Vista mobile vs desktop
- Modal de filtros en mobile

### ✅ Carrito (cart.spec.ts)
- Ver carrito vacío
- Agregar productos
- Cambiar cantidades
- Eliminar productos
- Ver subtotal/total
- Proceder a checkout
- Persistencia del carrito
- Contador en header

### ✅ Checkout Invitado (checkout-guest.spec.ts)
- Acceder sin registrarse
- Completar información de contacto
- Información de entrega
- Selección de método de envío
- Selección de método de pago
- Validación de campos
- Resumen del pedido
- Completar compra

### ✅ Checkout Registrado (checkout-registered.spec.ts)
- Checkout autenticado
- Direcciones guardadas
- Agregar nueva dirección
- Métodos de pago guardados
- Aplicar cupones/descuentos
- Ver pedidos anteriores

### ✅ Autenticación (auth.spec.ts)
- Registro de usuario
- Login
- Logout
- Validación de formularios
- Recuperar contraseña
- Ver/ocultar contraseña

## Requisitos Previos

1. **Backend corriendo** (opcional pero recomendado):
   ```bash
   cd "B:\Xenova\Le Pas Sage\ecommerce\ecommerce_backend"
   php artisan serve
   ```

2. **Node.js instalado** (v18+)

3. **Dependencias instaladas**:
   ```bash
   npm install
   ```

## Comandos

### Instalar Playwright (primera vez)
```bash
npx playwright install
```

### Correr todos los tests
```bash
npx playwright test
```

### Correr tests en modo UI (interactivo)
```bash
npx playwright test --ui
```

### Correr tests específicos
```bash
# Solo tests de home
npx playwright test home

# Solo tests de productos
npx playwright test products

# Solo tests de carrito
npx playwright test cart

# Solo tests de checkout invitado
npx playwright test checkout-guest

# Solo tests de autenticación
npx playwright test auth
```

### Correr tests en modo headed (ver el navegador)
```bash
npx playwright test --headed
```

### Correr tests en un navegador específico
```bash
# Solo Chrome
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo Safari
npx playwright test --project=webkit
```

### Ver reporte de resultados
```bash
npx playwright show-report
```

### Modo debug (paso a paso)
```bash
npx playwright test --debug
```

### Correr tests específicos con patrón
```bash
# Tests que contengan "carrito"
npx playwright test -g "carrito"

# Tests que contengan "filtro"
npx playwright test -g "filtro"
```

## Tests Marcados como Skip

Algunos tests están marcados con `test.skip()` porque:
- Requieren usuario autenticado en la base de datos
- Crearían pedidos reales en el sistema
- Requieren configuración adicional

Para correrlos, remueve `.skip` y asegúrate de tener:
- Backend corriendo con base de datos de testing
- Usuario de prueba creado
- Productos en stock

## Configuración

La configuración se encuentra en `playwright.config.ts`:
- **baseURL**: `http://localhost:3000`
- **webServer**: Auto-inicia el frontend con `npm run dev`
- **Screenshot**: Se toma en fallos
- **Video**: Se graba en fallos
- **Trace**: Se guarda en retry

## Mejores Prácticas

1. **Backend**: Los tests funcionan mejor con el backend corriendo
2. **Tests aislados**: Cada test es independiente
3. **Datos dinámicos**: Los tests manejan casos donde no hay datos
4. **Responsive**: Algunos tests verifican mobile y desktop
5. **Timeouts**: Se usan waitForTimeout para operaciones asíncronas

## Debugging

### Ver qué está pasando
```bash
npx playwright test --headed --debug
```

### Generar trace
```bash
npx playwright test --trace on
```

### Ver trace de un test fallido
```bash
npx playwright show-trace trace.zip
```

### Playwright Inspector
```bash
PWDEBUG=1 npx playwright test
```

## CI/CD

Los tests están configurados para CI:
- Retries: 2 intentos en CI
- Workers: 1 worker en CI (para estabilidad)
- Screenshots y videos se guardan en fallos

## Variables de Entorno

El frontend usa variables de `.env.local`:
- `NEXT_PUBLIC_API_URL`: URL del backend (default: http://localhost:8000/api/v1)
- `NEXT_PUBLIC_SITE_NAME`: Nombre del sitio

## Troubleshooting

### Error: "page.goto: net::ERR_CONNECTION_REFUSED"
- Asegúrate que el frontend esté corriendo en `http://localhost:3000`
- O configura `webServer` en playwright.config.ts

### Tests lentos
- Usa `--workers=1` para correr tests en serie
- Reduce timeouts si no son necesarios

### Tests intermitentes
- Aumenta timeouts para operaciones lentas
- Verifica que el backend responda correctamente
- Usa `waitForLoadState('networkidle')` antes de interacciones

### No encuentra elementos
- Usa Playwright Inspector: `PWDEBUG=1 npx playwright test`
- Verifica selectores con `page.locator().highlight()`

## Próximos Pasos

1. Agregar tests de categorías específicas
2. Tests de búsqueda de productos
3. Tests de wishlist
4. Tests de perfil de usuario
5. Tests de direcciones guardadas
6. Tests de integración con Mercado Pago
7. Tests de performance

## Recursos

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors](https://playwright.dev/docs/selectors)
- [Assertions](https://playwright.dev/docs/test-assertions)
