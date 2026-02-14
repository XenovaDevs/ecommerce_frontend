import { APIRequestContext, expect, request } from '@playwright/test';
import { API_BASE_URL as FRONT_API_BASE, API_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || FRONT_API_BASE || 'http://localhost:8000/api/v1';

export const customerCredentials = {
  email: process.env.E2E_CUSTOMER_EMAIL || 'customer@example.com',
  password: process.env.E2E_CUSTOMER_PASSWORD || 'password',
};

type AnyJson = Record<string, any>;

const apiPath = (path: string) => (path.startsWith('/') ? path.slice(1) : path);

export const unwrapData = <T>(payload: AnyJson | undefined): T => {
  if (!payload) return [] as unknown as T;
  return (payload.data ?? payload) as T;
};

export async function newApiContext(token?: string): Promise<APIRequestContext> {
  const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return request.newContext({
    baseURL: normalizedBase,
    extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    ignoreHTTPSErrors: true,
  });
}

export async function loginAsCustomer(): Promise<{ token: string; api: APIRequestContext }> {
  const api = await newApiContext();
  const res = await api.post(apiPath(API_ENDPOINTS.AUTH.LOGIN), {
    data: {
      email: customerCredentials.email,
      password: customerCredentials.password,
    },
  });

  expect(res.ok(), `login status ${res.status()}`).toBeTruthy();
  const body = await res.json().catch(() => ({}));
  const token = body?.data?.access_token ?? body?.access_token;
  expect(token, 'access token from login').toBeTruthy();

  return { token, api };
}

export async function getFirstProduct(api: APIRequestContext): Promise<{ slug: string; id?: string } | null> {
  const res = await api.get(apiPath(API_ENDPOINTS.PRODUCTS.LIST));
  if (!res.ok()) return null;
  const list = unwrapData<any[]>(await res.json());
  const product = list?.[0];
  if (!product) return null;
  return { slug: product.slug ?? product.identifier ?? product.id, id: product.id };
}

export async function getFirstCategory(api: APIRequestContext): Promise<{ slug: string; id?: string } | null> {
  const res = await api.get(apiPath(API_ENDPOINTS.CATEGORIES.LIST));
  if (!res.ok()) return null;
  const list = unwrapData<any[]>(await res.json());
  const category = list?.[0];
  if (!category) return null;
  return { slug: category.slug ?? category.id ?? category.code, id: category.id };
}

export async function ensureCartWithItem(api: APIRequestContext, productId: string): Promise<void> {
  await api.post(apiPath(API_ENDPOINTS.CART.ADD_ITEM), {
    data: {
      product_id: productId,
      quantity: 1,
    },
  });
}

export async function ensureAddress(api: APIRequestContext): Promise<string | null> {
  const res = await api.post(apiPath(API_ENDPOINTS.USER.ADDRESS_CREATE), {
    data: {
      name: 'QA Address',
      address: 'Test 123',
      city: 'Buenos Aires',
      province: 'Buenos Aires',
      country: 'AR',
      postal_code: '1000',
      phone: '+5491111111111',
    },
  });
  if (!res.ok()) return null;
  const body = unwrapData<any>(await res.json());
  return body?.id ?? body?.uuid ?? null;
}

export { API_BASE_URL, API_ENDPOINTS, apiPath };
