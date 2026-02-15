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

export default function HomePage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <TrustBar />

      {/* Featured Products */}
      <section className="relative py-24 sm:py-32">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 gradient-dark-radial pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Destacados"
              title="Fragancias que inspiran"
              description="Los aromas más elegidos por quienes valoran lo extraordinario."
              align="left"
            />
            <Link
              href={ROUTES.PRODUCTS}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sage-cream hover:text-sage-gold transition-colors shrink-0 group"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <FeaturedProducts />
          <div className="mt-10 text-center sm:hidden">
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline" size="md" className="group border-sage-surface-hover text-sage-cream hover:border-sage-gold/40">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BrandStory />

      {/* Categories */}
      <section className="relative py-24 sm:py-32">
        {/* Gold radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sage-gold/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <SectionHeader
            eyebrow="Colecciones"
            title="Explorá por categoría"
            description="Encontrá la fragancia perfecta para cada espacio."
            align="center"
          />
          <CategoriesSection />
        </div>
      </section>

      <PromoBanner />

      {/* New Arrivals */}
      <section className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sage-surface/50 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-2">
            <SectionHeader
              eyebrow="Novedades"
              title="Recién llegados"
              description="Lo último que incorporamos a nuestra colección."
              align="left"
            />
            <Link
              href={ROUTES.PRODUCTS}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-sage-cream hover:text-sage-gold transition-colors shrink-0 group"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <NewArrivals />
        </div>
      </section>

      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
