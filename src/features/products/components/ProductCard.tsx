'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const mainImage = product.images?.[0]?.url || '/images/placeholder-product.svg';
  const hoverImage = product.images?.[1]?.url;

  const productUrl = ROUTES.PRODUCT_DETAIL(product.slug);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-sage-surface-light bg-sage-surface transition-all duration-300 hover:border-sage-gold/20 hover:shadow-gold-glow hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-square overflow-hidden bg-gradient-to-br from-sage-surface-light to-sage-surface-hover">
        <Image
          src={imageError ? '/images/placeholder-product.svg' : (isHovered && hoverImage ? hoverImage : mainImage)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlay on Hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-sage-black/40 to-transparent transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <Badge variant="glow" size="sm" className="shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
          {product.is_new && (
            <Badge variant="gradient-sage" size="sm" pulse>
              Nuevo
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="outline" size="sm" className="bg-sage-surface/90 backdrop-blur-sm text-sage-cream border-sage-surface-hover">
              Agotado
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={cn(
            'absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 z-10',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          )}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.(product);
            }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl glass-dark shadow-lg transition-all duration-200 hover:scale-110',
              isInWishlist ? 'text-red-400' : 'text-sage-cream/70 hover:text-red-400'
            )}
            aria-label={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current')} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = productUrl;
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl glass-dark text-sage-cream/70 shadow-lg transition-all duration-200 hover:text-sage-gold hover:scale-110"
            aria-label="Ver producto"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        {product.category && (
          <Link
            href={ROUTES.CATEGORY_DETAIL(product.category.slug)}
            className="mb-2 text-xs font-medium text-sage-gold/70 hover:text-sage-gold transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Name */}
        <Link href={productUrl} className="mb-3">
          <h3 className="line-clamp-2 text-base font-semibold text-sage-cream transition-colors hover:text-sage-gold leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-sage-cream">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-sage-ivory/35 line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant={product.stock === 0 ? "outline" : "gold"}
          size="md"
          className="w-full"
          disabled={product.stock === 0}
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>
    </div>
  );
}
