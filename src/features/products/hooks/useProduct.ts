'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../services';
import type { Product } from '../types';

/**
 * @ai-context Hook for fetching a single product by slug.
 */

interface UseProductState {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface UseProductReturn extends UseProductState {
  refresh: () => Promise<void>;
}

export function useProduct(slug: string): UseProductReturn {
  const [state, setState] = useState<UseProductState>({
    product: null,
    isLoading: true,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    if (!slug) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const product = await productsService.getProduct(slug);
      setState({
        product,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        product: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error loading product',
      });
    }
  }, [slug]);

  const refresh = useCallback(() => fetchProduct(), [fetchProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    refresh,
  };
}
