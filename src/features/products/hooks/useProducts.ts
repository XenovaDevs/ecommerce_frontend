'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { productsService } from '../services';
import type { Product, ProductFilters } from '../types';

/**
 * @ai-context Hook for managing products list with filters and pagination.
 *             Syncs filters with URL search params.
 */

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasMore: boolean;
  };
  loadMore: () => void;
  refresh: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
  page: 1,
  per_page: 12,
  sort: 'newest',
};

export function useProducts(initialFilters?: Partial<ProductFilters>): UseProductsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });

  // Parse filters from URL
  const getFiltersFromUrl = useCallback((): ProductFilters => {
    const filters: ProductFilters = { ...DEFAULT_FILTERS, ...initialFilters };

    const search = searchParams.get('search');
    const categoryId = searchParams.get('category_id');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const inStock = searchParams.get('in_stock');
    const onSale = searchParams.get('on_sale');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');

    if (search) filters.search = search;
    if (categoryId) filters.category_id = Number(categoryId);
    if (minPrice) filters.min_price = Number(minPrice);
    if (maxPrice) filters.max_price = Number(maxPrice);
    if (inStock === 'true') filters.in_stock = true;
    if (onSale === 'true') filters.on_sale = true;
    if (sort) filters.sort = sort as ProductFilters['sort'];
    if (page) filters.page = Number(page);

    return filters;
  }, [searchParams, initialFilters]);

  const [filters, setFiltersState] = useState<ProductFilters>(getFiltersFromUrl);

  // Sync filters to URL
  const syncFiltersToUrl = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          value !== DEFAULT_FILTERS[key as keyof ProductFilters]
        ) {
          params.set(key, String(value));
        }
      });

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Fetch products
  const fetchProducts = useCallback(
    async (currentFilters: ProductFilters, append = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsService.getProducts(currentFilters);

        setProducts((prev) =>
          append ? [...prev, ...response.data] : response.data
        );
        setPagination({
          currentPage: response.meta.current_page,
          totalPages: response.meta.total_pages,
          total: response.meta.total,
          hasMore: response.meta.has_more,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error loading products'));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Set filters and sync to URL
  const setFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 };
      setFiltersState(updated);
      syncFiltersToUrl(updated);
    },
    [filters, syncFiltersToUrl]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    syncFiltersToUrl(DEFAULT_FILTERS);
  }, [syncFiltersToUrl]);

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    if (!pagination.hasMore || isLoading) return;

    const newFilters = { ...filters, page: pagination.currentPage + 1 };
    setFiltersState(newFilters);
    fetchProducts(newFilters, true);
  }, [filters, pagination, isLoading, fetchProducts]);

  // Refresh
  const refresh = useCallback(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // Initial fetch and when filters change
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFiltersState(urlFilters);
    fetchProducts(urlFilters);
  }, [searchParams, fetchProducts, getFiltersFromUrl]);

  return {
    products,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pagination,
    loadMore,
    refresh,
  };
}


