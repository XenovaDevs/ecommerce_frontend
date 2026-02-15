import { Package } from 'lucide-react';
import { EmptyState } from '@/components/common';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

/**
 * @ai-context Responsive grid for displaying products.
 *             Handles loading, empty, and populated states.
 * @ai-props
 *   - products: Array of products to display
 *   - isLoading: Shows skeleton placeholders
 *   - onAddToCart: Callback for cart action
 *   - onToggleWishlist: Callback for wishlist action
 *   - wishlistIds: Set of product IDs in wishlist
 */

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: Set<number>;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-sage-surface-light bg-sage-surface shadow-sm animate-slide-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="aspect-square bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-16 rounded bg-sage-surface-light animate-pulse" />
            <div className="h-4 w-full rounded bg-sage-surface-light animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-sage-surface-light animate-pulse" />
            <div className="h-5 w-24 rounded bg-sage-surface-light animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-sage-surface-light animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading = false,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = new Set(),
  emptyMessage = 'No se encontraron productos',
  emptyAction,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-16 w-16 text-sage-ivory/35" />}
        title={emptyMessage}
        description="Intenta ajustar los filtros o buscar algo diferente"
        action={emptyAction}
        className="text-sage-cream"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={wishlistIds.has(product.id)}
          />
        </div>
      ))}
    </div>
  );
}

export { ProductGridSkeleton };
