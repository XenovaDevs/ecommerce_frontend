import { apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type {
  Product,
  ProductFilters,
  ProductsResponse,
  ProductResponse,
  Category,
} from '../types';

/**
 * @ai-context Products API service for fetching products and categories.
 */

class ProductsService {
  /**
   * Get paginated list of products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get single product by slug
   */
  async getProduct(slug: string): Promise<Product> {
    const response = await apiClient.get<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.DETAIL(slug)
    );
    return response.data.data;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await this.getProducts({
      is_featured: true,
      per_page: limit,
    });
    return response.data;
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
    const response = await apiClient.get<ProductsResponse>(
      `${API_ENDPOINTS.PRODUCTS.LIST}/${productId}/related?limit=${limit}`
    );
    return response.data.data;
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
    const response = await apiClient.get<{ data: Category[] }>(
      API_ENDPOINTS.CATEGORIES.LIST
    );
    return response.data.data;
  }

  /**
   * Get category by slug
   */
  async getCategory(slug: string): Promise<Category> {
    const response = await apiClient.get<{ data: Category }>(
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
