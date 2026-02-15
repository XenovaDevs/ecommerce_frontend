'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { productsService } from '@/features/products';
import { ROUTES } from '@/constants';
import { CategoryCard } from './CategoryCard';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import type { Category } from '@/features/products';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const cats = await productsService.getCategories();
      setCategories(cats.slice(0, 3));
      setError(null);
    } catch {
      setError('No pudimos cargar las categorias.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = () => {
    setIsLoading(true);
    setError(null);
    void loadCategories();
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-sage-ivory/30" />
        <p className="mb-4 text-sage-ivory/50">{error}</p>
        <Button variant="outline" size="md" onClick={fetchCategories} className="group">
          <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <Layers className="mb-4 h-10 w-10 text-sage-ivory/30" />
        <p className="mb-4 text-sage-ivory/50">Aun no hay categorias disponibles.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md">Ver todos los productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-14">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-sage-surface-light" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((category, i) => (
            <AnimatedContent
              key={category.id}
              distance={50}
              duration={0.7}
              delay={i * 0.15}
              ease="power3.out"
            >
              <CategoryCard
                category={category}
                index={i}
                isInView={true}
                featured={true}
              />
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
