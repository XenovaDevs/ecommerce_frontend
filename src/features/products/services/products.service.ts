import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type {
  Product,
  ProductFilters,
  ProductsResponse,
  Category,
} from '../types';

/**
 * @ai-context Products API service for fetching products and categories.
 */

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
    from?: number;
    to?: number;
  };
}

const SORT_MAP = {
  newest: { sortBy: 'created_at', sortDirection: 'desc' },
  oldest: { sortBy: 'created_at', sortDirection: 'asc' },
  price_asc: { sortBy: 'price', sortDirection: 'asc' },
  price_desc: { sortBy: 'price', sortDirection: 'desc' },
  name_asc: { sortBy: 'name', sortDirection: 'asc' },
  name_desc: { sortBy: 'name', sortDirection: 'desc' },
} as const;

class ProductsService {
  private buildParams(filters?: ProductFilters): URLSearchParams {
    const params = new URLSearchParams();

    if (!filters) {
      return params;
    }

    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', String(filters.category_id));
    if (filters.min_price !== undefined) params.append('min_price', String(filters.min_price));
    if (filters.max_price !== undefined) params.append('max_price', String(filters.max_price));
    if (filters.in_stock !== undefined) params.append('in_stock', String(filters.in_stock));
    if (filters.is_featured !== undefined) params.append('featured', String(filters.is_featured));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));

    if (filters.sort) {
      const mappedSort = SORT_MAP[filters.sort as keyof typeof SORT_MAP];
      if (mappedSort) {
        params.append('sort_by', mappedSort.sortBy);
        params.append('sort_direction', mappedSort.sortDirection);
      }
    }

    return params;
  }

  /**
   * Get paginated list of products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = this.buildParams(filters);
    const query = params.toString();
    const endpoint = query ? `${API_ENDPOINTS.PRODUCTS.LIST}?${query}` : API_ENDPOINTS.PRODUCTS.LIST;

    const response = await apiClient.get<ApiEnvelope<Product[]>>(
      endpoint
    );

    const pagination = response.data.pagination;

    return {
      data: response.data.data ?? [],
      meta: {
        current_page: pagination?.current_page ?? 1,
        per_page: pagination?.per_page ?? 0,
        total: pagination?.total ?? 0,
        total_pages: pagination?.total_pages ?? 1,
        has_more: pagination?.has_more ?? false,
      },
    };
  }

  /**
   * Get single product by slug
   */
  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get<ApiEnvelope<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(slug)
    );
    return response.data.data;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await apiClient.get<ApiEnvelope<Product[]>>(
      API_ENDPOINTS.PRODUCTS.FEATURED
    );
    return (response.data.data ?? []).slice(0, limit);
  }

  /**
   * Get new arrivals
   */
  async getNewArrivals(limit = 8): Promise<Product[]> {
    const response = await this.getProducts({
      is_new: true,
      sort: 'newest',
      per_page: limit,
    });
    return response.data;
  }

  /**
   * Get related products
   */
  async getRelatedProducts(productId: number, limit = 4): Promise<Product[]> {
    const response = await apiClient.get<ApiEnvelope<Product[]>>(
      `${API_ENDPOINTS.PRODUCTS.LIST}/${productId}/related?limit=${limit}`
    );
    return response.data.data ?? [];
  }

  /**
   * Search products
   */
  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    const response = await this.getProducts({
      search: query,
      per_page: limit,
    });
    return response.data;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiEnvelope<Category[]>>(
      API_ENDPOINTS.CATEGORIES.LIST
    );
    return response.data.data ?? [];
  }

  /**
   * Get category by slug
   */
  async getCategory(slug: string): Promise<Category> {
    const response = await apiClient.get<ApiEnvelope<Category>>(
      API_ENDPOINTS.CATEGORIES.DETAIL(slug)
    );
    return response.data.data;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categorySlug: string,
    filters?: Omit<ProductFilters, 'category_id'>
  ): Promise<ProductsResponse> {
    const category = await this.getCategory(categorySlug);
    return this.getProducts({ ...filters, category_id: category.id });
  }
}

export const productsService = new ProductsService();
