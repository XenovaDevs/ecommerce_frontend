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
      setError(err instanceof Error ? err.message : 'Error al cargar la categoria');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData(filters);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilters = (newFilters: Partial<ProductFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };

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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-20 h-[460px] w-[460px] rounded-full bg-sage-gold/[0.04] blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-sage-ivory/45 animate-fade-in">
          <Link href={ROUTES.HOME} className="hover:text-sage-gold transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={ROUTES.CATEGORIES} className="hover:text-sage-gold transition-colors">
            Categorias
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-sage-cream">{category?.name || '...'}</span>
        </nav>

        <div className="mb-10 animate-slide-up">
          <h1 className="font-display text-4xl font-bold text-sage-cream sm:text-5xl">
            {category?.name || 'Cargando...'}
          </h1>
          {category?.description && (
            <p className="mt-3 text-lg text-sage-ivory/55">{category.description}</p>
          )}
          <p className="mt-2 text-sm text-sage-ivory/45">
            {pagination.total > 0
              ? `${pagination.total} productos encontrados`
              : !isLoading ? 'No hay productos en esta categoria' : ''}
          </p>
        </div>

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

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <p className="text-sm font-medium text-sage-ivory/60">
                {pagination.total} productos
              </p>
              <MobileFilterButton
                onClick={() => setIsMobileFiltersOpen(true)}
                activeCount={activeFiltersCount}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/25 p-6 animate-slide-down">
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            <ProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              emptyMessage="No se encontraron productos en esta categoria"
              emptyAction={
                activeFiltersCount > 0 ? (
                  <Button onClick={resetFilters}>Limpiar filtros</Button>
                ) : (
                  <Link href={ROUTES.PRODUCTS}>
                    <Button variant="gold">Ver todos los productos</Button>
                  </Link>
                )
              }
            />

            {pagination.hasMore && !isLoading && (
              <div className="mt-12 text-center animate-fade-in">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  className="border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
                >
                  Cargar mas productos
                </Button>
              </div>
            )}

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

        <Modal
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          title="Filtros"
          className="bg-sage-surface border-sage-surface-hover text-sage-cream [&>div]:border-sage-surface-hover [&>div_h2]:text-sage-cream [&>div_button]:text-sage-ivory/60 [&>div_button:hover]:bg-sage-surface-hover [&>div_button:hover]:text-sage-cream"
        >
          <div className="p-1">
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
                className="flex-1 border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => setIsMobileFiltersOpen(false)}
                variant="gold"
                className="flex-1"
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

export default function CategoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 animate-slide-up">
            <div className="mb-3 h-10 w-56 rounded-lg bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
            <div className="h-6 w-72 rounded-lg bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer shadow-sm" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-sage-surface-light animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-sage-surface-light animate-pulse" />
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
