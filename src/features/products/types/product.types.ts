/**
 * @ai-context Product-related types for the ecommerce frontend.
 */

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
  position: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductAttribute {
  name: string;
  values: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: number;
  products_count?: number;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  low_stock_threshold?: number;
  weight?: number;
  status: ProductStatus;
  is_featured?: boolean;
  is_new?: boolean;
  category_id?: number;
  category?: Category;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export type ProductSortField =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'best_selling';

export interface ProductFilters {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  sort?: ProductSortField;
  page?: number;
  per_page?: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

export interface ProductResponse {
  data: Product;
}
