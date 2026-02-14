import { test, expect } from '@playwright/test';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  apiPath,
  ensureAddress,
  getFirstCategory,
  getFirstProduct,
  loginAsCustomer,
  newApiContext,
  unwrapData,
} from './utils/api';

test.describe('API contract - público', () => {
  test('lista de productos', async () => {
    const api = await newApiContext();
    const res = await api.get(apiPath(API_ENDPOINTS.PRODUCTS.LIST));
    expect(res.ok()).toBeTruthy();
    const list = unwrapData<any[]>(await res.json());
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('detalle de producto', async () => {
    const api = await newApiContext();
    const product = await getFirstProduct(api);
    expect(product).toBeTruthy();
    const res = await api.get(apiPath(API_ENDPOINTS.PRODUCTS.DETAIL(product!.slug)));
    expect(res.ok()).toBeTruthy();
  });

  test('categorías y árbol', async () => {
    const api = await newApiContext();
    const categories = await api.get(apiPath(API_ENDPOINTS.CATEGORIES.LIST));
    expect(categories.ok()).toBeTruthy();
    const tree = await api.get(apiPath(API_ENDPOINTS.CATEGORIES.TREE));
    expect(tree.ok()).toBeTruthy();
  });

  test('productos por categoría', async () => {
    const api = await newApiContext();
    const category = await getFirstCategory(api);
    expect(category).toBeTruthy();
    const res = await api.get(apiPath(API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category!.id || category!.slug)));
    expect(res.ok()).toBeTruthy();
  });

  test('productos destacados y búsqueda', async () => {
    const api = await newApiContext();
    const featured = await api.get(apiPath(API_ENDPOINTS.PRODUCTS.FEATURED));
    expect(featured.status()).toBeLessThan(500);

    const search = await api.post(apiPath(API_ENDPOINTS.PRODUCTS.SEARCH), { data: { q: 'test' } });
    expect(search.status()).toBeLessThan(500);
  });
});

test.describe('API contract - autenticado', () => {
  let token: string;
  let api: Awaited<ReturnType<typeof newApiContext>>;

  test.beforeAll(async () => {
    const auth = await loginAsCustomer();
    token = auth.token;
    api = await newApiContext(token);
  });

  test('perfil de usuario', async () => {
    const res = await api.get(apiPath(API_ENDPOINTS.USER.PROFILE));
    expect(res.ok()).toBeTruthy();
  });

  test('carrito CRUD', async () => {
    const product = await getFirstProduct(api);
    expect(product?.id).toBeTruthy();
    const add = await api.post(apiPath(API_ENDPOINTS.CART.ADD_ITEM), { data: { product_id: product!.id, quantity: 1 } });
    expect(add.ok()).toBeTruthy();

    const cart = await api.get(apiPath(API_ENDPOINTS.CART.GET));
    expect(cart.ok()).toBeTruthy();

    const cartBody = unwrapData<any>(await cart.json());
    const itemId = cartBody?.items?.[0]?.id;
    if (itemId) {
      const update = await api.patch(apiPath(API_ENDPOINTS.CART.UPDATE_ITEM(String(itemId))), { data: { quantity: 2 } });
      expect(update.ok()).toBeTruthy();
      const remove = await api.delete(apiPath(API_ENDPOINTS.CART.REMOVE_ITEM(String(itemId))));
      expect(remove.ok()).toBeTruthy();
    }
  });

  test('direcciones', async () => {
    const id = await ensureAddress(api);
    expect(id).toBeTruthy();
    const list = await api.get(apiPath(API_ENDPOINTS.USER.ADDRESSES));
    expect(list.ok()).toBeTruthy();
    const del = await api.delete(apiPath(API_ENDPOINTS.USER.ADDRESS_DELETE(String(id))));
    expect(del.status()).toBeLessThan(500);
  });

  test('checkout validate y preferencia de pago', async () => {
    const validate = await api.post(apiPath(API_ENDPOINTS.CHECKOUT.VALIDATE), { data: {} });
    expect(validate.status()).toBeLessThan(500);
    const pref = await api.post(apiPath(API_ENDPOINTS.CHECKOUT.PAYMENT_PREFERENCE), { data: {} });
    expect(pref.status()).toBeLessThan(500);
  });

  test('ordenes lista', async () => {
    const res = await api.get(apiPath(API_ENDPOINTS.ORDERS.LIST));
    expect(res.status()).toBeLessThan(500);
  });
});

test('base URL configurada', () => {
  expect(API_BASE_URL).toBeTruthy();
});
