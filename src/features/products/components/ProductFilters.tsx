'use client';

import { useState } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Category, ProductFilters as Filters, ProductSortField } from '../types';

/**
 * @ai-context Product filters sidebar/modal with category, price, and sorting.
 * @ai-props
 *   - categories: Available categories
 *   - filters: Current filter state
 *   - onFiltersChange: Callback when filters change
 *   - onReset: Callback to reset all filters
 */

interface ProductFiltersProps {
  categories: Category[];
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const SORT_OPTIONS: { value: ProductSortField; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre: A-Z' },
  { value: 'name_desc', label: 'Nombre: Z-A' },
  { value: 'best_selling', label: 'Más vendidos' },
];

const PRICE_RANGES = [
  { min: 0, max: 5000, label: 'Hasta $5.000' },
  { min: 5000, max: 15000, label: '$5.000 - $15.000' },
  { min: 15000, max: 30000, label: '$15.000 - $30.000' },
  { min: 30000, max: 50000, label: '$30.000 - $50.000' },
  { min: 50000, max: undefined, label: 'Más de $50.000' },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
}: ProductFiltersProps) {
  const activeFiltersCount = [
    filters.category_id,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.on_sale,
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="info" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-primary hover:underline"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Sort (mobile-friendly select) */}
      <FilterSection title="Ordenar por">
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFiltersChange({ sort: e.target.value as ProductSortField })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Categorías">
        <div className="space-y-2">
          <button
            onClick={() => onFiltersChange({ category_id: undefined })}
            className={cn(
              'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
              !filters.category_id
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Todas las categorías
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onFiltersChange({ category_id: category.id })}
              className={cn(
                'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                filters.category_id === category.id
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {category.name}
              {category.products_count !== undefined && (
                <span className="ml-2 text-gray-400">({category.products_count})</span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Precio">
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => {
            const isSelected =
              filters.min_price === range.min && filters.max_price === range.max;
            return (
              <button
                key={index}
                onClick={() =>
                  onFiltersChange({
                    min_price: isSelected ? undefined : range.min,
                    max_price: isSelected ? undefined : range.max,
                  })
                }
                className={cn(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  isSelected
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Custom range */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) =>
              onFiltersChange({ min_price: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) =>
              onFiltersChange({ max_price: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </FilterSection>

      {/* Quick Filters */}
      <FilterSection title="Filtros rápidos">
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={filters.in_stock || false}
              onChange={(e) => onFiltersChange({ in_stock: e.target.checked || undefined })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Solo con stock</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={filters.on_sale || false}
              onChange={(e) => onFiltersChange({ on_sale: e.target.checked || undefined })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">En oferta</span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
}

// Mobile Filter Button
interface MobileFilterButtonProps {
  onClick: () => void;
  activeCount: number;
}

export function MobileFilterButton({ onClick, activeCount }: MobileFilterButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className="lg:hidden">
      <SlidersHorizontal className="mr-2 h-4 w-4" />
      Filtros
      {activeCount > 0 && (
        <Badge variant="info" className="ml-2 text-xs">
          {activeCount}
        </Badge>
      )}
    </Button>
  );
}

// Active Filters Tags
interface ActiveFiltersProps {
  filters: Filters;
  categories: Category[];
  onRemove: (key: keyof Filters) => void;
  onReset: () => void;
}

export function ActiveFilters({ filters, categories, onRemove, onReset }: ActiveFiltersProps) {
  const tags: { key: keyof Filters; label: string }[] = [];

  if (filters.category_id) {
    const category = categories.find((c) => c.id === filters.category_id);
    if (category) {
      tags.push({ key: 'category_id', label: category.name });
    }
  }

  if (filters.min_price || filters.max_price) {
    const label =
      filters.min_price && filters.max_price
        ? `${formatCurrency(filters.min_price)} - ${formatCurrency(filters.max_price)}`
        : filters.min_price
        ? `Desde ${formatCurrency(filters.min_price)}`
        : `Hasta ${formatCurrency(filters.max_price!)}`;
    tags.push({ key: 'min_price', label });
  }

  if (filters.in_stock) {
    tags.push({ key: 'in_stock', label: 'Con stock' });
  }

  if (filters.on_sale) {
    tags.push({ key: 'on_sale', label: 'En oferta' });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">Filtros activos:</span>
      {tags.map((tag) => (
        <Badge
          key={tag.key}
          variant="info"
          className="flex items-center gap-1 pl-3 pr-2"
        >
          {tag.label}
          <button
            onClick={() => onRemove(tag.key)}
            className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
            aria-label={`Quitar filtro: ${tag.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onReset}
        className="text-sm text-primary hover:underline"
      >
        Limpiar todos
      </button>
    </div>
  );
}
