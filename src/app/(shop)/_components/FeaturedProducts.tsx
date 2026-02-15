'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ProductCard, productsService } from '@/features/products';
import { useCart } from '@/features/cart';
import { ROUTES } from '@/constants';
import { QuickViewModal } from './QuickViewModal';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import type { Product } from '@/features/products';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  const loadProducts = async () => {
    try {
      const featured = await productsService.getFeaturedProducts(4);
      setProducts(featured);
      setError(null);
    } catch {
      setError('No pudimos cargar los productos destacados.');
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

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch {
      // Error handled by cart context notifications.
    }
  };

  if (error) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-sage-ivory/30" />
        <p className="mb-4 text-sage-ivory/50">{error}</p>
        <Button variant="outline" size="md" onClick={fetchProducts} className="group">
          <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="mb-4 h-10 w-10 text-sage-ivory/30" />
        <p className="mb-4 text-sage-ivory/50">Aun no hay productos destacados.</p>
        <Link href={ROUTES.PRODUCTS}>
          <Button variant="outline" size="md">Ver catalogo completo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-square animate-shimmer rounded-2xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-sage-surface-light" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-sage-surface-light" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <AnimatedContent
              key={product.id}
              distance={40}
              duration={0.6}
              delay={i * 0.12}
              ease="power3.out"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </AnimatedContent>
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
