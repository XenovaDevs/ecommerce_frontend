/**
 * @ai-context Common shared types used across the application.
 */

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  label?: string;
}

export interface Money {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  is_primary?: boolean;
}

export type Status = 'active' | 'inactive' | 'pending' | 'archived';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SortOption {
  value: string;
  label: string;
  field: string;
  order: 'asc' | 'desc';
}
