'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import {
  ProductGrid,
  ProductFiltersComponent,
  MobileFilterButton,
  ActiveFilters,
  useCategories,
  productsService,
} from '@/features/products';
import { useCart } from '@/features/cart';
import { ROUTES } from '@/constants';
import type { Product, ProductFilters, Category } from '@/features/products';

/**
 * @ai-context Category detail page showing products filtered by category.
 */

export const dynamic = 'force-dynamic';

function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>({});
  const [pagination, setPagination] = useState({ total: 0, hasMore: false, page: 1 });

  const { categories } = useCategories();
  const { addItem } = useCart();

  const fetchData = useCallback(async (currentFilters: ProductFilters, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const cat = await productsService.getCategory(slug);
      setCategory(cat);

      const response = await productsService.getProducts({
        ...currentFilters,
        category_id: cat.id,
      });

      setProducts((prev) => (append ? [...prev, ...response.data] : response.data));
      setPagination({
        total: response.meta.total,
        hasMore: response.meta.has_more,
        page: response.meta.current_page,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la categoría');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData(filters);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilters = (newFilters: Partial<ProductFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    // Clean undefined values
    Object.keys(updated).forEach((key) => {
      if (updated[key as keyof ProductFilters] === undefined) {
        delete updated[key as keyof ProductFilters];
      }
    });
    setFiltersState(updated);
    fetchData(updated);
  };

  const resetFilters = () => {
    setFiltersState({});
    fetchData({});
  };

  const loadMore = () => {
    const nextPage = pagination.page + 1;
    const updated = { ...filters, page: nextPage };
    setFiltersState(updated);
    fetchData(updated, true);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const activeFiltersCount = [
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.on_sale,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 animate-fade-in">
        <Link href={ROUTES.HOME} className="hover:text-gray-900 transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={ROUTES.CATEGORIES} className="hover:text-gray-900 transition-colors">
          Categorías
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-gray-900">{category?.name || '...'}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          {category?.name || 'Cargando...'}
        </h1>
        {category?.description && (
          <p className="mt-3 text-lg text-gray-600">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} productos encontrados`
            : !isLoading ? 'No hay productos en esta categoría' : ''}
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
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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
            <p className="text-sm font-medium text-gray-700">
              {pagination.total} productos
            </p>
            <MobileFilterButton
              onClick={() => setIsMobileFiltersOpen(true)}
              activeCount={activeFiltersCount}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-6 animate-slide-down">
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
          )}

          {/* Products */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            emptyMessage="No se encontraron productos en esta categoría"
            emptyAction={
              activeFiltersCount > 0 ? (
                <Button onClick={resetFilters}>Limpiar filtros</Button>
              ) : (
                <Link href={ROUTES.PRODUCTS}>
                  <Button>Ver todos los productos</Button>
                </Link>
              )
            }
          />

          {/* Load More */}
          {pagination.hasMore && !isLoading && (
            <div className="mt-12 text-center animate-fade-in">
              <Button onClick={loadMore} variant="outline" size="lg">
                Cargar más productos
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          {!isLoading && products.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-gray-600">
                Mostrando <span className="text-gray-900">{products.length}</span> de{' '}
                <span className="text-gray-900">{pagination.total}</span> productos
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
      >
        <div className="p-4">
          <ProductFiltersComponent
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            isLoading={isLoading}
          />
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
            <Button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex-1"
            >
              Ver resultados
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 animate-slide-up">
            <div className="h-10 w-56 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-shimmer mb-3" />
            <div className="h-6 w-72 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-shimmer" />
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-shimmer shadow-sm" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
