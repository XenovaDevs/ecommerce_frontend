'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import type { Category } from '@/features/products';

interface CategoryCardProps {
  category: Category;
  index: number;
  isInView: boolean;
  featured?: boolean;
}

export function CategoryCard({ category, index, isInView, featured = false }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={ROUTES.CATEGORY_DETAIL(category.slug)}
      className={`category-card-shell group relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-elegant-lg ${
        featured ? 'aspect-[4/5] sm:row-span-2' : 'aspect-[4/3]'
      } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {category.image_url && !imageError ? (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-surface-light to-sage-surface-hover">
          <Layers className="h-10 w-10 text-sage-ivory/30" />
        </div>
      )}

      {/* Gold border slide from left on hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-sage-gold scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-10" />

      <div className="category-card-overlay absolute inset-0" />

      <div className="relative p-5">
        <h3 className="text-base font-semibold text-sage-white tracking-tight">
          {category.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {category.products_count !== undefined && (
            <span className="inline-flex items-center rounded-full bg-sage-gold/20 px-2.5 py-0.5 text-sage-gold font-medium">
              {category.products_count} productos
            </span>
          )}
          <ChevronRight className="h-3 w-3 text-sage-gold transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
