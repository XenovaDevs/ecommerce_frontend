'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../services';
import type { Product } from '../types';

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
    isLoading: Boolean(slug),
    error: slug ? null : 'Missing product slug',
  });

  const refresh = useCallback(async () => {
    if (!slug) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const product = await productsService.getProduct(slug);
      setState({ product, isLoading: false, error: null });
    } catch (error) {
      setState({
        product: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error loading product',
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const bootstrap = async () => {
      try {
        const product = await productsService.getProduct(slug);
        if (!isMounted) return;
        setState({ product, isLoading: false, error: null });
      } catch (error) {
        if (!isMounted) return;
        setState({
          product: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error loading product',
        });
      }
    };

    void bootstrap();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    ...state,
    refresh,
  };
}
