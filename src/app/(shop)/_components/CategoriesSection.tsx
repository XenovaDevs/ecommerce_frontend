'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { productsService } from '@/features/products';
import { useInView } from '@/hooks/useInView';
import { ROUTES } from '@/constants';
import { CategoryCard } from './CategoryCard';
import type { Category } from '@/features/products';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref, isInView } = useInView();

  const fetchCategories = () => {
    setIsLoading(true);
    setError(null);
    productsService
      .getCategories()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => setError('No pudimos cargar las categorías.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">{error}</p>
        <Button variant="outline" size="md" onClick={fetchCategories} className="group">
          <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <Layers className="h-10 w-10 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Aún no hay categorías disponibles.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md">Ver todos los productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {categories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              isInView={isInView}
              featured={i < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
