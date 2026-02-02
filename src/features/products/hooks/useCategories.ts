'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../services';
import type { Category } from '../types';

/**
 * @ai-context Hook for fetching categories.
 */

interface UseCategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface UseCategoriesReturn extends UseCategoriesState {
  refresh: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    isLoading: true,
    error: null,
  });

  const fetchCategories = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const categories = await productsService.getCategories();

      setState({
        categories,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        categories: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error loading categories',
      });
    }
  }, []);

  const refresh = useCallback(() => fetchCategories(), [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...state,
    refresh,
  };
}
