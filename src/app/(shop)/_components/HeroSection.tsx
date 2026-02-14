'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { ROUTES } from '@/constants';

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center overflow-hidden bg-sage-black">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial gold glow */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text */}
          <div className="max-w-xl">
            <div
              className={`transition-all duration-700 delay-100 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Badge variant="outline-gold" size="lg">
                Colección 2025
              </Badge>
            </div>

            <h1
              className={`mt-8 transition-all duration-700 delay-200 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="block text-gray-400 text-base sm:text-lg lg:text-xl font-light tracking-wide">
                Bienvenido a
              </span>
              <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-sage-white leading-[0.95] font-display">
                Le Pas
                <span className="text-gradient-gold"> Sage</span>
              </span>
            </h1>

            <p
              className={`mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-md transition-all duration-700 delay-300 ${
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
              className={`mt-8 flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link href={ROUTES.PRODUCTS} className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="group w-full sm:w-auto animate-shimmer-gold-btn">
                  Explorar colección
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-700 text-sage-white hover:bg-sage-white/5 hover:border-gray-500 w-full sm:w-auto"
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
              <div className="absolute inset-0 border border-sage-gold/20 rounded-2xl" />
              <div className="absolute inset-3 border border-sage-gold/10 rounded-xl overflow-hidden bg-gray-900/50">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-sage-black" />
                <div className="absolute inset-0 animate-shimmer-gold opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-sage-gold/20 tracking-tighter font-display">LPS</div>
                    <div className="mt-2 h-px w-12 mx-auto bg-sage-gold/30" />
                    <div className="mt-2 text-xs tracking-[0.3em] text-sage-gold/30 uppercase">
                      Est. 2025
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl gradient-gold opacity-20 blur-2xl" />
              <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-sage-gold/10 blur-xl" />
            </div>
          </div>

          {/* Mobile decorative element */}
          <div
            className={`lg:hidden flex justify-center transition-all duration-1000 delay-400 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-sage-gold/40" />
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="text-xs tracking-[0.3em] text-sage-gold/40 uppercase font-display">LPS</div>
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-sage-gold/40" />
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
