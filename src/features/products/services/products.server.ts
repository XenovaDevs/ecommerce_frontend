import 'server-only';

import { cache } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Product } from '../types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const fetchJson = async <T>(
  endpoint: string,
  options: {
    revalidate: number;
    tags: string[];
  }
): Promise<T | null> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    next: {
      revalidate: options.revalidate,
      tags: options.tags,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    const payload = await fetchJson<ApiEnvelope<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(slug), {
      revalidate: 300,
      tags: ['products', `product:${slug}`],
    });

    return payload?.data ?? null;
  } catch {
    return null;
  }
});

export const getProductsForStaticParams = cache(async (): Promise<Array<{ slug: string }>> => {
  try {
    const payload = await fetchJson<ApiEnvelope<Product[]>>(`${API_ENDPOINTS.PRODUCTS.LIST}?per_page=100`, {
      revalidate: 600,
      tags: ['products'],
    });

    if (!payload?.data?.length) {
      return [];
    }

    return payload.data
      .filter((product) => typeof product.slug === 'string' && product.slug.length > 0)
      .map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
});
