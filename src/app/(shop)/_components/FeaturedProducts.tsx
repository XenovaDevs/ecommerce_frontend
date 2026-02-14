'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ProductCard, productsService } from '@/features/products';
import { useCart } from '@/features/cart';
import { useInView } from '@/hooks/useInView';
import { ROUTES } from '@/constants';
import { QuickViewModal } from './QuickViewModal';
import type { Product } from '@/features/products';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { ref, isInView } = useInView();

  const fetchProducts = () => {
    setIsLoading(true);
    setError(null);
    productsService
      .getFeaturedProducts(8)
      .then(setProducts)
      .catch(() => setError('No pudimos cargar los productos destacados.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch {}
  };

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
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
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-10 w-10 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Aún no hay productos destacados.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md">Ver catálogo completo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-shimmer" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 rounded bg-gray-200 animate-pulse w-3/4" />
                <div className="h-3 rounded bg-gray-200 animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`transition-all duration-600 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
