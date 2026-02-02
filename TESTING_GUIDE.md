# Guía de Testing - Le Pas Sage Ecommerce

## 🚀 Quick Start

### 1. Instalar navegadores de Playwright (primera vez)
```bash
npx playwright install
```

### 2. Correr todos los tests
```bash
npm test
```

### 3. Ver tests en modo UI (recomendado)
```bash
npm run test:ui
```

## 📋 Checklist Pre-Testing

- [ ] Frontend corriendo en `http://localhost:3000`
- [ ] Backend corriendo en `http://localhost:8000` (opcional)
- [ ] Navegadores de Playwright instalados
- [ ] Variables de entorno configuradas en `.env.local`

## 🎯 Escenarios de Prueba Cubiertos

### 1. Flujo de Compra sin Registro (Invitado)
✅ Navegar productos → Filtrar → Agregar al carrito → Checkout como invitado → Completar datos

**Test:** `checkout-guest.spec.ts`
```bash
npm run test:checkout
```

### 2. Flujo de Compra con Registro
✅ Registrarse → Login → Navegar productos → Agregar al carrito → Checkout con datos guardados

**Tests:** `auth.spec.ts` + `checkout-registered.spec.ts`
```bash
npm run test:auth
```

### 3. Gestión de Productos
✅ Ver listado → Aplicar filtros (categoría, precio, stock) → Ver detalles → Agregar al carrito

**Test:** `products.spec.ts`
```bash
npm run test:products
```

### 4. Gestión de Carrito
✅ Agregar productos → Cambiar cantidades → Eliminar → Ver totales → Proceder a checkout

**Test:** `cart.spec.ts`
```bash
npm run test:cart
```

### 5. Navegación General
✅ Página de inicio → Features → Newsletter → Productos destacados → Navegación

**Test:** `home.spec.ts`
```bash
npm run test:home
```

## 🔧 Comandos Útiles

### Testing Básico
```bash
# Todos los tests
npm test

# Tests específicos por archivo
npm run test:home
npm run test:products
npm run test:cart
npm run test:checkout
npm run test:auth

# Tests con patrón
npx playwright test -g "carrito"
npx playwright test -g "filtro"
```

### Debugging
```bash
# Ver el navegador mientras corre
npm run test:headed

# Modo debug (paso a paso)
npm run test:debug

# UI mode (mejor opción)
npm run test:ui
```

### Resultados
```bash
# Ver último reporte
npm run test:report

# Correr solo tests fallidos
npx playwright test --last-failed
```

### Navegadores Específicos
```bash
# Solo Chrome
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo Safari
npx playwright test --project=webkit
```

## 📱 Testing Mobile vs Desktop

Algunos tests verifican comportamiento responsive:

```javascript
// Mobile viewport
await page.setViewportSize({ width: 375, height: 667 });

// Desktop viewport (default)
await page.setViewportSize({ width: 1280, height: 720 });
```

**Tests que verifican mobile:**
- `products.spec.ts` - Modal de filtros en mobile
- Vista mobile del carrito
- Navegación responsive

## ⚙️ Configuración del Backend

### Opción 1: Sin Backend
Los tests funcionan parcialmente sin backend. Verás errores de API pero los tests de UI seguirán funcionando.

### Opción 2: Con Backend (Recomendado)

1. **Iniciar backend:**
```bash
cd "B:\Xenova\Le Pas Sage\ecommerce\ecommerce_backend"
php artisan serve
```

2. **Verificar .env del backend:**
```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
# o tu configuración de MySQL
```

3. **Seed de datos de prueba (opcional):**
```bash
php artisan migrate:fresh --seed
```

## 🎭 Tests Marcados como Skip

Algunos tests están con `test.skip()` porque:
- Crean datos reales en la base de datos
- Requieren usuario autenticado existente
- Envían emails u otras acciones permanentes

**Para habilitarlos:**
1. Remover `.skip` del test
2. Asegurarse que el backend esté corriendo
3. Tener datos de prueba apropiados

Ejemplo:
```typescript
// Skippeado (no corre)
test.skip('debe completar checkout', async ({ page }) => { ... });

// Habilitado (corre)
test('debe completar checkout', async ({ page }) => { ... });
```

## 🐛 Debugging Tips

### Test falla con "Element not found"
```bash
# Ver el test en modo UI
npm run test:ui

# O en modo debug
npm run test:debug
```

### Ver qué está pasando en el navegador
```bash
# Headed mode (ver navegador)
npm run test:headed

# Slow motion (más lento, ver mejor)
npx playwright test --headed --slow-mo=1000
```

### Capturar screenshots
Los screenshots se toman automáticamente en fallos:
```
test-results/
  <test-name>/
    test-failed-1.png
```

### Ver trace de un test
```bash
# Generar trace
npx playwright test --trace on

# Ver trace
npx playwright show-trace trace.zip
```

### Playwright Inspector
```bash
# Windows
set PWDEBUG=1 && npx playwright test

# Linux/Mac
PWDEBUG=1 npx playwright test
```

## 📊 Estructura de Datos Esperada

### Productos
```json
{
  "id": 1,
  "name": "Producto Test",
  "price": 1000,
  "stock": 10,
  "category_id": 1,
  "images": [...]
}
```

### Usuario Test
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

## 🔒 Tests de Seguridad

Los tests verifican:
- ✅ Validación de formularios (email, contraseña)
- ✅ Campos requeridos
- ✅ Formato de datos
- ✅ Prevención de envío con datos inválidos

## 📈 Métricas de Testing

Después de correr los tests, verás:
- ✅ Tests pasados
- ❌ Tests fallados
- ⏭️ Tests skippeados
- ⏱️ Tiempo de ejecución

Ejemplo:
```
  6 passed (12.5s)
  8 skipped
  0 failed
```

## 🚨 Troubleshooting Común

### Error: "net::ERR_CONNECTION_REFUSED"
**Solución:** El frontend no está corriendo
```bash
npm run dev
```

### Error: "Timeout 30000ms exceeded"
**Solución:** Aumentar timeout o verificar que el backend responde
```typescript
await page.waitForTimeout(5000); // Aumentar tiempo
```

### Tests intermitentes (flaky)
**Solución:** Agregar esperas apropiadas
```typescript
await page.waitForLoadState('networkidle');
await page.waitForSelector('selector');
```

### "Cannot find module '@playwright/test'"
**Solución:** Reinstalar dependencias
```bash
npm install
```

### Navegadores no instalados
**Solución:**
```bash
npx playwright install
```

## 📝 Escribir Nuevos Tests

### Template básico:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mi Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mi-pagina');
  });

  test('debe hacer algo', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Click' });

    // Act
    await button.click();

    // Assert
    await expect(page).toHaveURL('/nueva-pagina');
  });
});
```

### Best Practices:
1. Usar selectores semánticos (`getByRole`, `getByText`)
2. Esperar a elementos antes de interactuar
3. Tests independientes (no depender de orden)
4. Limpiar datos después del test
5. Usar datos dinámicos para evitar colisiones

## 🎯 Próximos Tests a Implementar

- [ ] Búsqueda de productos
- [ ] Wishlist
- [ ] Comparar productos
- [ ] Reviews/Ratings
- [ ] Compartir en redes sociales
- [ ] Newsletter signup
- [ ] Contacto
- [ ] FAQs
- [ ] Tracking de pedidos
- [ ] Devoluciones

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**¿Problemas?** Abre un issue o contacta al equipo de desarrollo.
