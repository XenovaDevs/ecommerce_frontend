'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, CreditCard, Headphones, Layers } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/constants';
import { ProductCard, productsService } from '@/features/products';
import { useCart } from '@/features/cart';
import type { Product, Category } from '@/features/products';

/**
 * @ai-context Home page with hero section, features, featured products and categories.
 */

const features = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: `En compras mayores a ${APP_CONFIG.FREE_SHIPPING_MIN.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Tus datos siempre protegidos',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pagos',
    description: 'Tarjetas, Mercado Pago y más',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    productsService
      .getFeaturedProducts(4)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({ product_id: product.id, quantity: 1 });
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-shimmer" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <ProductCard product={product} onAddToCart={handleAddToCart} />
        </div>
      ))}
    </div>
  );
}

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productsService
      .getCategories()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category, i) => (
        <CategoryCard key={category.id} category={category} index={i} />
      ))}
    </div>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={ROUTES.CATEGORY_DETAIL(category.slug)}
      className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4 text-center transition-all duration-300 hover:shadow-lg hover-lift animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
        {category.image_url && !imageError ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Layers className="h-8 w-8 text-gray-300" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      {category.products_count !== undefined && (
        <p className="mt-1 text-xs text-gray-500">
          {category.products_count} productos
        </p>
      )}
    </Link>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Bienvenido a{' '}
              <span className="text-primary">{APP_CONFIG.SITE_NAME}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Descubre nuestra colección de productos de alta calidad. Envío a todo el país con las mejores opciones de pago.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg">
                  Ver productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES}>
                <Button variant="outline" size="lg">
                  Explorar categorías
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Productos destacados
            </h2>
            <Link
              href={ROUTES.PRODUCTS}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Explora por categoría
            </h2>
            <Link
              href={ROUTES.CATEGORIES}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <CategoriesSection />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary/5 px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Suscríbete a nuestro newsletter
            </h2>
            <p className="mt-2 text-gray-600">
              Recibe ofertas exclusivas y novedades directamente en tu email.
            </p>
            <form className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit">Suscribirse</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
