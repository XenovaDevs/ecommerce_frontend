'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useCategories } from '@/features/products';
import type { Category } from '@/features/products';

export const dynamic = 'force-dynamic';

function CategoryCard({ category }: { category: Category }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={ROUTES.CATEGORY_DETAIL(category.slug)}
      className="category-card-shell group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-sage-gold/25 hover:shadow-gold-glow hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-surface-light to-sage-surface-hover">
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
            <Layers className="h-12 w-12 text-sage-ivory/25" />
          </div>
        )}

        <div className="category-card-overlay absolute inset-0" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-xl font-bold text-sage-white">{category.name}</h3>
          {category.products_count !== undefined && (
            <p className="mt-1 text-sm text-sage-white/85">
              {category.products_count} {category.products_count === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>
      </div>

      {category.description && (
        <div className="p-5">
          <p className="line-clamp-2 text-sm text-sage-ivory/55">{category.description}</p>
        </div>
      )}

      <div className="absolute right-4 top-4 flex h-8 w-8 translate-x-2 items-center justify-center rounded-full border border-sage-gold/25 bg-background/75 text-sage-gold opacity-0 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-sage-gold/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-display text-4xl font-bold text-sage-cream sm:text-5xl">Categorias</h1>
          <p className="mt-3 text-lg text-sage-ivory/55">
            Explora nuestras categorias y encuentra lo que buscas
          </p>
        </div>

        {categories.length > 6 && (
          <div className="mb-8 max-w-md animate-slide-down">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-ivory/35 transition-colors group-focus-within:text-sage-gold" />
              <input
                type="search"
                placeholder="Buscar categorias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-sage-surface-hover bg-sage-surface-light py-2.5 pl-10 pr-4 text-sm text-sage-cream placeholder:text-sage-ivory/35 focus:border-sage-gold/40 focus:outline-none focus:ring-2 focus:ring-sage-gold/10 transition-all"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/25 p-6 animate-slide-down">
            <p className="text-sm font-medium text-red-300">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer" />
                <div className="mt-4 space-y-2">
                  <div className="h-5 w-1/2 rounded bg-sage-surface-light animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-sage-surface-light animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

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

        {!isLoading && filteredCategories.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <Layers className="mb-4 h-16 w-16 text-sage-ivory/25" />
            <h3 className="text-lg font-semibold text-sage-cream">
              {searchQuery ? 'No se encontraron categorias' : 'No hay categorias disponibles'}
            </h3>
            <p className="mt-2 text-sm text-sage-ivory/45">
              {searchQuery
                ? 'Intenta con otro termino de busqueda'
                : 'Vuelve mas tarde para ver nuestras categorias'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4 border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
                onClick={() => setSearchQuery('')}
              >
                Limpiar busqueda
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
