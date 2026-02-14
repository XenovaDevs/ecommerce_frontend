'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { ROUTES } from '@/constants';
import SplitText from '@/components/reactbits/TextAnimations/SplitText/SplitText';
import BlurText from '@/components/reactbits/TextAnimations/BlurText/BlurText';
import RotatingText from '@/components/reactbits/TextAnimations/RotatingText/RotatingText';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import FadeContent from '@/components/reactbits/Animations/FadeContent/FadeContent';

const Aurora = dynamic(
  () => import('@/components/reactbits/Backgrounds/Aurora/Aurora'),
  { ssr: false }
);

export function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center overflow-hidden bg-sage-black">
      {/* Aurora Background - desktop only */}
      {isDesktop && (
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <Aurora
            colorStops={['#BF9B60', '#A58146', '#D9BF91']}
            amplitude={0.8}
            blend={0.6}
            speed={0.4}
          />
        </div>
      )}

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text */}
          <div className="max-w-xl">
            <AnimatedContent distance={30} duration={0.6} delay={0.1}>
              <Badge variant="outline-gold" size="lg">
                Colección 2025
              </Badge>
            </AnimatedContent>

            <h1 className="mt-8">
              <FadeContent blur duration={600} delay={200}>
                <span className="block text-gray-400 text-base sm:text-lg lg:text-xl font-light tracking-wide">
                  Bienvenido a
                </span>
              </FadeContent>
              <div className="mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] font-display">
                <SplitText
                  text="Le Pas"
                  tag="span"
                  className="text-sage-white"
                  delay={40}
                  duration={0.8}
                  splitType="chars"
                  textAlign="left"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                />
                {' '}
                <SplitText
                  text="Sage"
                  tag="span"
                  className="text-sage-gold"
                  delay={40}
                  duration={0.8}
                  splitType="chars"
                  textAlign="left"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                />
              </div>
            </h1>

            <div className="mt-6">
              <BlurText
                text="Descubrí nuestra selección curada de productos premium. Calidad excepcional, diseño sofisticado."
                className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-md"
                delay={30}
                animateBy="words"
                direction="bottom"
              />
            </div>

            {/* Rotating text accent */}
            <div className="mt-4 flex items-center gap-3 text-sm">
              <div className="h-px w-8 bg-sage-gold/30" />
              <RotatingText
                texts={['Elegancia', 'Sofisticación', 'Armonía', 'Serenidad']}
                mainClassName="text-sage-gold font-medium tracking-wide"
                rotationInterval={3000}
                staggerDuration={0.02}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
              <div className="h-px w-8 bg-sage-gold/30" />
            </div>

            {/* Gold accent line */}
            <FadeContent duration={1000} delay={400}>
              <div className="mt-8 h-px w-16 bg-gradient-to-r from-sage-gold to-transparent" />
            </FadeContent>

            {/* CTA Buttons */}
            <FadeContent duration={800} delay={500}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
            </FadeContent>
          </div>

          {/* Right - Decorative visual with 3D tilt */}
          <div className="relative hidden lg:block">
            <AnimatedContent distance={60} duration={1} delay={0.3} scale={0.95}>
              <div className="relative aspect-[4/5] max-w-md mx-auto group" style={{ perspective: '800px' }}>
                <div className="absolute inset-0 border border-sage-gold/20 rounded-2xl" />
                <div className="absolute inset-3 border border-sage-gold/10 rounded-xl overflow-hidden bg-gray-900/50 transition-transform duration-300 ease-out" style={{ transformStyle: 'preserve-3d' }}>
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
            </AnimatedContent>
          </div>

          {/* Mobile decorative element */}
          <FadeContent duration={800} delay={400} className="lg:hidden flex justify-center">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-sage-gold/40" />
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="text-xs tracking-[0.3em] text-sage-gold/40 uppercase font-display">LPS</div>
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-sage-gold/40" />
            </div>
          </FadeContent>
        </div>
      </div>

      {/* Scroll indicator */}
      <FadeContent duration={700} delay={700} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-sage-gold/60 to-transparent animate-pulse-subtle" />
      </FadeContent>
    </section>
  );
}
