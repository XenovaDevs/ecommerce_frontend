'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useCategories } from '@/features/products';
import type { Category } from '@/features/products';

/**
 * @ai-context Categories listing page showing all product categories.
 */

export const dynamic = 'force-dynamic';

function CategoryCard({ category }: { category: Category }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={ROUTES.CATEGORY_DETAIL(category.slug)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {category.image_url && !imageError ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-bold text-white">
            {category.name}
          </h3>
          {category.products_count !== undefined && (
            <p className="mt-1 text-sm text-white/80">
              {category.products_count} {category.products_count === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {category.description && (
        <div className="p-5">
          <p className="line-clamp-2 text-sm text-gray-600">
            {category.description}
          </p>
        </div>
      )}

      {/* Arrow indicator */}
      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Categorías</h1>
        <p className="mt-3 text-lg text-gray-600">
          Explora nuestras categorías y encuentra lo que buscas
        </p>
      </div>

      {/* Search */}
      {categories.length > 6 && (
        <div className="mb-8 max-w-md animate-slide-down">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gray-900" />
            <input
              type="search"
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-6 animate-slide-down">
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-shimmer" />
              <div className="mt-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category, i) => (
            <div
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCategories.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <Layers className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            {searchQuery ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery
              ? 'Intenta con otro término de búsqueda'
              : 'Vuelve más tarde para ver nuestras categorías'}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
