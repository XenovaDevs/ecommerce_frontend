'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, ChevronRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/constants';
import type { Product } from '@/features/products';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !product) return null;

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;
  const mainImage = product.images?.[0]?.url || '/images/placeholder-product.svg';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sage-surface-light bg-sage-surface shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid sm:grid-cols-2">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-sage-surface-light to-sage-surface-hover sm:aspect-square">
              <Image
                src={imageError ? '/images/placeholder-product.svg' : mainImage}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              {hasDiscount && (
                <Badge variant="glow-gold" size="sm" className="absolute left-3 top-3 shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-sage-surface-hover bg-background/80 text-sage-ivory/70 transition-colors hover:text-sage-gold sm:hidden"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex flex-col p-4 sm:p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 hidden h-8 w-8 items-center justify-center rounded-lg text-sage-ivory/45 transition-colors hover:bg-sage-surface-hover hover:text-sage-cream sm:flex"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>

              {product.category && (
                <span className="text-xs font-medium uppercase tracking-wider text-sage-gold">
                  {product.category.name}
                </span>
              )}

              <h3 className="mt-2 font-display text-xl font-bold leading-tight text-sage-cream">
                {product.name}
              </h3>

              {product.short_description && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-sage-ivory/55">
                  {product.short_description}
                </p>
              )}

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-sage-cream">
                  {formatCurrency(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-sage-ivory/35 line-through">
                    {formatCurrency(product.compare_at_price!)}
                  </span>
                )}
              </div>

              <div className="mt-auto space-y-3 pt-6">
                <Button
                  variant={product.stock === 0 ? 'outline' : 'gold'}
                  size="lg"
                  className="w-full border-sage-surface-hover"
                  disabled={product.stock === 0}
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </Button>
                <Link href={ROUTES.PRODUCT_DETAIL(product.slug)} onClick={onClose}>
                  <Button
                    variant="outline"
                    size="md"
                    className="group w-full border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
                  >
                    Ver detalle completo
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
