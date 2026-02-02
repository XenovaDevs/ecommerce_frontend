# 🚀 Inicio Rápido - Tests E2E

## ⚡ 3 Comandos para Empezar

### 1️⃣ Instalar Playwright (solo primera vez)
```bash
npx playwright install
```

### 2️⃣ Correr tests en modo UI (recomendado)
```bash
npm run test:ui
```

### 3️⃣ Ver resultados
Los resultados se muestran en la interfaz UI de Playwright.

---

## 📋 Opciones Alternativas

### Correr todos los tests en consola
```bash
npm test
```

### Ver el navegador mientras corre
```bash
npm run test:headed
```

### Tests específicos
```bash
npm run test:home          # Página principal
npm run test:products      # Productos y filtros
npm run test:cart          # Carrito
npm run test:checkout      # Checkout
npm run test:auth          # Login y registro
```

### Menú interactivo (Windows)
```bash
RUN_TESTS.bat
```

---

## ✅ Lo que se prueba

1. **Home** - Página principal, features, navegación
2. **Productos** - Listado, filtros (categoría, precio, stock)
3. **Carrito** - Agregar, modificar, eliminar productos
4. **Checkout** - Proceso completo de compra (invitado y registrado)
5. **Auth** - Registro y login de usuarios

---

## 📊 Resumen

- **65 tests** en total
- **57 tests activos** (corren por defecto)
- **8 tests skippeados** (requieren autenticación)
- **~40 segundos** de ejecución

---

## 🐛 Si algo falla

1. Ver screenshot del error en `test-results/`
2. Correr en modo UI: `npm run test:ui`
3. Ver documentación: `tests/README.md`

---

## 📚 Documentación Completa

- **tests/README.md** - Guía completa de tests
- **tests/RESUMEN_TESTS.md** - Resumen ejecutivo
- **TESTING_GUIDE.md** - Guía de uso detallada
- **INSTRUCCIONES_TESTING.txt** - Instrucciones con formato

---

## ✨ Características

✅ Tests automáticos de todos los flujos de compra
✅ Screenshots automáticos en fallos
✅ Videos de fallos grabados
✅ Tests responsive (mobile/desktop)
✅ Configuración lista para usar

---

**¡Listo para probar!** 🎉

Ejecuta `npm run test:ui` para comenzar.
