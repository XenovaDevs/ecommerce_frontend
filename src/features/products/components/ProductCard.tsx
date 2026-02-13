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

/**
 * @ai-context ProductCard displays a single product in the catalog grid.
 *             Handles image, price, discount badge, add to cart, wishlist toggle.
 * @ai-props
 *   - product: Product data with id, name, slug, price, images, etc.
 *   - onAddToCart: Optional callback when adding to cart
 *   - onToggleWishlist: Optional callback for wishlist
 * @ai-a11y
 *   - Images have alt text
 *   - Buttons have aria-labels
 *   - Focus states for keyboard navigation
 */

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={productUrl} className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
          "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300",
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
            <Badge variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
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
              'flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110',
              isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm text-gray-600 shadow-lg transition-all duration-200 hover:text-primary hover:scale-110"
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
            className="mb-2 text-xs font-medium text-primary/80 hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}

        {/* Name */}
        <Link href={productUrl} className="mb-3">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors hover:text-primary leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant={product.stock === 0 ? "outline" : "sage"}
          size="md"
          className="w-full shadow-sm"
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

