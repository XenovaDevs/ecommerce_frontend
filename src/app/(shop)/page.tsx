'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';
import {
  HeroSection,
  TrustBar,
  FeaturedProducts,
  NewArrivals,
  BrandStory,
  PromoBanner,
  CategoriesSection,
  TestimonialsSection,
  NewsletterSection,
  SectionHeader,
} from './_components';

/**
 * @ai-context Le Pas Sage Home - Premium luxury landing page.
 * Slim orchestrator importing all section components.
 */

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

      {/* New Arrivals */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-2">
            <SectionHeader
              eyebrow="Novedades"
              title="Recién llegados"
              description="Lo último que incorporamos a nuestra colección."
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
          <NewArrivals />
        </div>
      </section>

      <BrandStory />
      <PromoBanner />

      {/* Categories */}
      <section className="py-20 sm:py-24">
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

      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
