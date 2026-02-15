'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ProductCard, productsService } from '@/features/products';
import { useCart } from '@/features/cart';
import { ROUTES } from '@/constants';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import type { Product } from '@/features/products';

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addItem } = useCart();

  const loadProducts = async () => {
    try {
      const arrivals = await productsService.getNewArrivals(6);
      setProducts(arrivals);
      setError(null);
    } catch {
      setError('No pudimos cargar los nuevos productos.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = () => {
    setIsLoading(true);
    setError(null);
    void loadProducts();
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    el.scrollBy({ left: direction === 'left' ? -cardWidth - 20 : cardWidth + 20, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [products]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch {
      // Error handled by cart context notifications.
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-sage-ivory/35" />
        <p className="mb-4 text-sage-ivory/55">{error}</p>
        <Button variant="outline" size="md" onClick={fetchProducts} className="group border-sage-surface-hover text-sage-cream hover:bg-sage-surface-light">
          <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="mb-4 h-10 w-10 text-sage-ivory/35" />
        <p className="mb-4 text-sage-ivory/55">No hay novedades por ahora.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md" className="border-sage-surface-hover text-sage-cream hover:bg-sage-surface-light">Ver catalogo completo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mt-12">
      {!isLoading && products.length > 3 && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-gold/20 bg-card text-sage-gold shadow-lg transition-all hover:border-sage-gold/40 hover:bg-sage-gold/10 sm:flex ${
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-gold/20 bg-card text-sage-gold shadow-lg transition-all hover:border-sage-gold/40 hover:bg-sage-gold/10 sm:flex ${
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {isLoading ? (
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[260px] flex-shrink-0">
              <div className="aspect-square animate-pulse rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-sage-surface-light" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-sage-surface-light" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {products.map((product, i) => (
            <AnimatedContent
              key={product.id}
              distance={40}
              duration={0.5}
              delay={i * 0.08}
              ease="power3.out"
              className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
