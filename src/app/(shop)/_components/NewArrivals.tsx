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

  const fetchProducts = () => {
    setIsLoading(true);
    setError(null);
    productsService
      .getNewArrivals(8)
      .then(setProducts)
      .catch(() => setError('No pudimos cargar los nuevos productos.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
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
    } catch {}
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">{error}</p>
        <Button variant="outline" size="md" onClick={fetchProducts} className="group">
          <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-10 w-10 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">No hay novedades por ahora.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md">Ver catálogo completo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation arrows */}
      {!isLoading && products.length > 3 && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 hover:text-sage-black hover:border-gray-300 transition-all ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg text-gray-600 hover:text-sage-black hover:border-gray-300 transition-all ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-shimmer" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 rounded bg-gray-200 animate-pulse w-3/4" />
                <div className="h-3 rounded bg-gray-200 animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
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
