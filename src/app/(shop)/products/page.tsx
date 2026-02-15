'use client';

import { useState, Suspense } from 'react';
import { Button, Modal } from '@/components/ui';
import {
  ProductGrid,
  ProductFiltersComponent,
  MobileFilterButton,
  ActiveFilters,
  useProducts,
  useCategories,
} from '@/features/products';
import { useCart } from '@/features/cart';
import type { Product } from '@/features/products/types';

export const dynamic = 'force-dynamic';

function ProductsContent() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const {
    products,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pagination,
    loadMore,
  } = useProducts();

  const { categories } = useCategories();
  const { addItem } = useCart();

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({
        product_id: product.id,
        quantity: 1,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const activeFiltersCount = [
    filters.category_id,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.on_sale,
  ].filter(Boolean).length;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-sage-gold/[0.04] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-sage-cream sm:text-5xl font-display">Productos</h1>
        <p className="mt-3 text-lg text-sage-ivory/50">
          {pagination.total > 0
            ? `${pagination.total} productos encontrados`
            : 'Explora nuestro catálogo completo'}
        </p>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mb-8 animate-slide-down">
          <ActiveFilters
            filters={filters}
            categories={categories}
            onRemove={(key) => setFilters({ [key]: undefined })}
            onReset={resetFilters}
          />
        </div>
      )}

      <div className="lg:grid lg:grid-cols-4 lg:gap-10">
        {/* Desktop Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-sage-surface-light bg-sage-surface p-6">
              <ProductFiltersComponent
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                isLoading={isLoading}
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Button */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-sm font-medium text-sage-ivory/60">
              {pagination.total} productos
            </p>
            <MobileFilterButton
              onClick={() => setIsMobileFiltersOpen(true)}
              activeCount={activeFiltersCount}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-red-900/20 border border-red-500/20 p-6 animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-300">
                  {error instanceof Error ? error.message : String(error)}
                </p>
              </div>
            </div>
          )}

          {/* Products */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            emptyMessage="No se encontraron productos con estos filtros"
            emptyAction={
              <Button onClick={resetFilters}>Limpiar filtros</Button>
            }
          />

          {/* Load More */}
          {pagination.hasMore && !isLoading && (
            <div className="mt-12 text-center animate-fade-in">
              <Button onClick={loadMore} variant="outline" size="lg" className="border-sage-surface-hover text-sage-cream hover:border-sage-gold/40">
                Cargar más productos
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          {!isLoading && products.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-sage-ivory/50">
                Mostrando <span className="text-sage-cream">{products.length}</span> de{' '}
                <span className="text-sage-cream">{pagination.total}</span> productos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
        <Modal
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          title="Filtros"
          fullOnMobile
          className="sm:max-w-lg bg-sage-surface border-sage-surface-hover text-sage-cream [&>div]:border-sage-surface-hover [&>div_h2]:text-sage-cream [&>div_button]:text-sage-ivory/60 [&>div_button:hover]:bg-sage-surface-hover [&>div_button:hover]:text-sage-cream"
        >
          <div className="p-1">
            <ProductFiltersComponent
              categories={categories}
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              isLoading={isLoading}
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setIsMobileFiltersOpen(false);
                }}
                className="flex-1"
                variant="gold"
              >
                Ver resultados
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 animate-slide-up">
          <div className="h-10 w-56 bg-gradient-to-r from-sage-surface-light to-sage-surface rounded-lg animate-shimmer mb-3" />
          <div className="h-6 w-72 bg-gradient-to-r from-sage-surface-light to-sage-surface rounded-lg animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="aspect-square bg-gradient-to-br from-sage-surface-light to-sage-surface-hover rounded-2xl animate-shimmer" />
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-sage-surface-light rounded animate-pulse w-3/4" />
                <div className="h-3 bg-sage-surface-light rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
