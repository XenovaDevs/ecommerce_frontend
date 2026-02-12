'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Truck,
  Shield,
  CreditCard,
  Headphones,
  Layers,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/constants';
import { ProductCard, productsService } from '@/features/products';
import { useCart } from '@/features/cart';
import type { Product, Category } from '@/features/products';

/**
 * @ai-context Le Pas Sage Home - Premium luxury landing page.
 * Black/White/Gold palette, editorial typography, staggered animations.
 */

// ─── Intersection Observer Hook ──────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || isInView) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        { threshold }
      );

      observerRef.current.observe(node);
    },
    [threshold, isInView]
  );

  return { ref, isInView };
}

// ─── Decorative Gold Line ────────────────────────────────────────────────────

function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sage-gold/40 to-transparent" />
      <div className="h-1.5 w-1.5 rotate-45 bg-sage-gold" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sage-gold/40 to-transparent" />
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  light?: boolean;
}) {
  const { ref, isInView } = useInView();
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div
      ref={ref}
      className={`max-w-2xl ${alignClass} transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <span
        className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold"
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] leading-[1.1] ${
          light ? 'text-sage-white' : 'text-sage-black'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {description}
        </p>
      )}
      <GoldDivider className="mt-6 max-w-[120px] mx-auto" />
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-sage-black">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial gold glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div
              className={`transition-all duration-700 delay-100 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Badge variant="outline-gold" size="lg">
                Colección 2025
              </Badge>
            </div>

            {/* Heading */}
            <h1
              className={`mt-8 transition-all duration-700 delay-200 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="block text-gray-400 text-lg sm:text-xl font-light tracking-wide">
                Bienvenido a
              </span>
              <span className="block mt-2 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-sage-white leading-[0.95]">
                Le Pas
                <span className="text-gradient-gold"> Sage</span>
              </span>
            </h1>

            {/* Description */}
            <p
              className={`mt-6 text-lg text-gray-400 leading-relaxed max-w-md transition-all duration-700 delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Descubrí nuestra selección curada de productos premium.
              Calidad excepcional, diseño sofisticado.
            </p>

            {/* Gold accent line */}
            <div
              className={`mt-8 h-px w-16 bg-gradient-to-r from-sage-gold to-transparent transition-all duration-1000 delay-400 ${
                loaded ? 'opacity-100 w-16' : 'opacity-0 w-0'
              }`}
            />

            {/* CTA Buttons */}
            <div
              className={`mt-8 flex flex-wrap gap-4 transition-all duration-700 delay-500 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link href={ROUTES.PRODUCTS}>
                <Button variant="gold" size="lg" className="group">
                  Explorar colección
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-700 text-sage-white hover:bg-sage-white/5 hover:border-gray-500"
                >
                  Ver categorías
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Decorative visual */}
          <div
            className={`relative hidden lg:block transition-all duration-1000 delay-300 ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Frame */}
              <div className="absolute inset-0 border border-sage-gold/20 rounded-2xl" />
              <div className="absolute inset-3 border border-sage-gold/10 rounded-xl overflow-hidden bg-gray-900/50">
                {/* Gradient fill */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-sage-black" />
                {/* Gold shimmer overlay */}
                <div className="absolute inset-0 animate-shimmer-gold opacity-40" />
                {/* Center emblem */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-sage-gold/20 tracking-tighter">LPS</div>
                    <div className="mt-2 h-px w-12 mx-auto bg-sage-gold/30" />
                    <div className="mt-2 text-xs tracking-[0.3em] text-sage-gold/30 uppercase">
                      Est. 2025
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl gradient-gold opacity-20 blur-2xl" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-sage-gold/10 blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-sage-gold/60 to-transparent animate-pulse-subtle" />
      </div>
    </section>
  );
}

// ─── Trust Features Bar ──────────────────────────────────────────────────────

const features = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: `Compras +${APP_CONFIG.FREE_SHIPPING_MIN.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}`,
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Datos siempre protegidos',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pagos',
    description: 'Tarjetas y Mercado Pago',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

function TrustBar() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="relative border-b border-gray-200 bg-sage-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group flex flex-col items-center text-center transition-all duration-500 ${
                isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-gold/30 text-sage-gold transition-all duration-300 group-hover:bg-sage-gold/10 group-hover:border-sage-gold/50">
                <feature.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-sage-black tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products ───────────────────────────────────────────────────────

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { ref, isInView } = useInView();

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

  return (
    <div ref={ref} className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-shimmer" />
              <div className="mt-4 space-y-2.5">
                <div className="h-4 rounded bg-gray-200 animate-pulse w-3/4" />
                <div className="h-3 rounded bg-gray-200 animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`transition-all duration-600 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Brand Story Section ─────────────────────────────────────────────────────

function BrandStory() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative overflow-hidden bg-sage-black py-24 sm:py-32">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 0.5px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div
            className={`transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
              Nuestra filosofía
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-sage-white tracking-tight leading-[1.1]">
              La esencia de
              <br />
              <span className="text-gradient-gold">lo auténtico</span>
            </h2>

            <div className="mt-6 h-px w-16 bg-gradient-to-r from-sage-gold to-transparent" />

            <p className="mt-6 text-gray-400 leading-relaxed text-base">
              En Le Pas Sage creemos que cada producto cuenta una historia.
              Seleccionamos cuidadosamente cada artículo para ofrecerte lo mejor
              en calidad, diseño y experiencia.
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed text-base">
              Nuestra misión es simple: acercar productos excepcionales a
              quienes valoran la diferencia entre lo común y lo extraordinario.
            </p>

            <div className="mt-10 flex flex-wrap gap-10">
              {[
                { value: '100%', label: 'Calidad garantizada' },
                { value: '24hs', label: 'Despacho rápido' },
                { value: '5★', label: 'Satisfacción' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div className="text-2xl font-bold text-sage-gold">{stat.value}</div>
                  <div className="mt-1 text-xs text-gray-500 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative mx-auto max-w-sm">
              {/* Decorative frame */}
              <div className="aspect-[3/4] rounded-2xl border border-sage-gold/15 p-4">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-sage-black flex items-center justify-center overflow-hidden relative">
                  {/* Inner shimmer */}
                  <div className="absolute inset-0 animate-shimmer-gold opacity-20" />
                  {/* Quote */}
                  <div className="relative p-8 text-center">
                    <Star className="h-6 w-6 text-sage-gold/40 mx-auto" strokeWidth={1} />
                    <p className="mt-4 text-gray-400 italic text-sm leading-relaxed">
                      &ldquo;Lo simple es la máxima sofisticación&rdquo;
                    </p>
                    <div className="mt-4 h-px w-8 mx-auto bg-sage-gold/30" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-sage-gold/50">
                      Leonardo da Vinci
                    </p>
                  </div>
                </div>
              </div>

              {/* Glow accents */}
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage-gold/5 blur-3xl" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-sage-gold/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Categories Section ──────────────────────────────────────────────────────

function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isInView } = useInView();

  useEffect(() => {
    productsService
      .getCategories()
      .then((cats) => setCategories(cats.slice(0, 6)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div ref={ref} className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategoryCard({
  category,
  index,
  isInView,
}: {
  category: Category;
  index: number;
  isInView: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={ROUTES.CATEGORY_DETAIL(category.slug)}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] cursor-pointer transition-all duration-500 hover:shadow-elegant-lg ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <Layers className="h-10 w-10 text-gray-300" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sage-black/80 via-sage-black/20 to-transparent" />

      {/* Content */}
      <div className="relative p-5">
        <h3 className="text-base font-semibold text-sage-white tracking-tight">
          {category.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-sage-gold text-xs font-medium">
          {category.products_count !== undefined && (
            <span>{category.products_count} productos</span>
          )}
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// ─── Newsletter Section ──────────────────────────────────────────────────────

function NewsletterSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative overflow-hidden bg-sage-black py-20 sm:py-24">
      {/* Gold radial accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className={`relative mx-auto max-w-xl px-6 text-center transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
          Newsletter
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-sage-white tracking-tight">
          Recibí novedades exclusivas
        </h2>
        <p className="mt-3 text-gray-500 text-sm">
          Ofertas, lanzamientos y contenido especial directo a tu correo.
        </p>

        <form
          className="mt-8 flex gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="tu@email.com"
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-sm text-sage-white placeholder-gray-600 focus:border-sage-gold/50 focus:outline-none focus:ring-1 focus:ring-sage-gold/30 transition-colors"
            aria-label="Email para newsletter"
          />
          <Button variant="gold" size="lg" className="shrink-0">
            Suscribirse
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-gray-600">
          Sin spam. Podés desuscribirte cuando quieras.
        </p>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustBar />

      {/* Featured Products */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Destacados"
              title="Productos seleccionados"
              description="Nuestra curaduría de los productos más elegidos por nuestros clientes."
              align="left"
            />
            <Link
              href={ROUTES.PRODUCTS}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sage-black hover:text-sage-gold transition-colors shrink-0 group"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <FeaturedProducts />
          <div className="mt-8 text-center sm:hidden">
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline" size="md" className="group">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BrandStory />

      {/* Categories */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Categorías"
              title="Explorá por categoría"
              description="Encontrá exactamente lo que buscás navegando nuestras colecciones."
              align="left"
            />
            <Link
              href={ROUTES.CATEGORIES}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sage-black hover:text-sage-gold transition-colors shrink-0 group"
            >
              Ver todas
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <CategoriesSection />
          <div className="mt-8 text-center sm:hidden">
            <Link href={ROUTES.CATEGORIES}>
              <Button variant="outline" size="md" className="group">
                Ver todas las categorías
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
