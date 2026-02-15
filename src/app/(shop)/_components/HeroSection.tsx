'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
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
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-background">
      {/* Aurora Background - desktop only, increased intensity */}
      {isDesktop && (
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
          <Aurora
            colorStops={['#C9A56A', '#A58146', '#E3C99B']}
            amplitude={1.0}
            blend={0.7}
            speed={0.4}
          />
        </div>
      )}

      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating gold orbs - more visible */}
      <div className="absolute top-[15%] right-[10%] h-64 w-64 rounded-full bg-sage-gold/[0.06] blur-[80px] animate-parallax-float" />
      <div className="absolute bottom-[20%] left-[5%] h-48 w-48 rounded-full bg-sage-gold/[0.08] blur-[60px] animate-parallax-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[60%] right-[30%] h-32 w-32 rounded-full bg-sage-gold/[0.05] blur-[50px] animate-float" style={{ animationDelay: '4s' }} />

      {/* Diagonal gold line accents */}
      <div className="absolute top-0 right-[20%] w-px h-[40vh] bg-gradient-to-b from-sage-gold/25 via-sage-gold/8 to-transparent rotate-[15deg] origin-top hidden lg:block" />
      <div className="absolute bottom-0 left-[15%] w-px h-[30vh] bg-gradient-to-t from-sage-gold/20 via-sage-gold/5 to-transparent -rotate-[10deg] origin-bottom hidden lg:block" />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text */}
          <div className="max-w-xl">
            <AnimatedContent distance={30} duration={0.6} delay={0.1}>
              <Badge variant="outline-gold" size="lg" className="animate-glow-gold">
                Colección 2026
              </Badge>
            </AnimatedContent>

            <h1 className="mt-8">
              <FadeContent blur duration={600} delay={200}>
                <span className="block text-sage-ivory/60 text-base sm:text-lg lg:text-xl font-light tracking-wide">
                  Bienvenido a
                </span>
              </FadeContent>
              <div className="mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] font-display">
                <SplitText
                  text="Le Pas"
                  tag="span"
                  className="text-sage-cream"
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

            <div className="mt-6 max-w-md">
              <BlurText
                text="Fragancias de ambiente que transforman cada espacio en una experiencia sensorial única."
                className="text-base sm:text-lg text-sage-ivory/60 leading-relaxed"
                delay={30}
                animateBy="words"
                direction="bottom"
              />
            </div>

            {/* Rotating text accent */}
            <div className="mt-5 flex items-center gap-3 text-sm">
              <div className="h-px w-10 bg-gradient-to-r from-sage-gold/50 to-sage-gold/10" />
              <RotatingText
                texts={['Elegancia', 'Sofisticación', 'Armonía', 'Serenidad']}
                mainClassName="text-sage-gold font-medium tracking-widest uppercase text-xs"
                rotationInterval={3000}
                staggerDuration={0.02}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
              <div className="h-px w-10 bg-gradient-to-l from-sage-gold/50 to-sage-gold/10" />
            </div>

            {/* CTA Buttons */}
            <FadeContent duration={800} delay={500}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href={ROUTES.PRODUCTS} className="w-full sm:w-auto">
                  <Button variant="gold" size="lg" className="group w-full sm:w-auto animate-shimmer-gold-btn text-base px-8 py-3.5">
                    Explorar colección
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href={ROUTES.CATEGORIES} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-sage-surface-hover text-sage-cream hover:bg-sage-surface-light hover:border-sage-gold/40 w-full sm:w-auto text-base px-8 py-3.5 transition-all duration-300"
                  >
                    Ver categorías
                  </Button>
                </Link>
              </div>
            </FadeContent>
          </div>

          {/* Right - Premium visual composition */}
          <div className="relative hidden lg:flex items-center justify-center">
            <AnimatedContent distance={60} duration={1} delay={0.3} scale={0.95}>
              <div className="relative w-[420px] h-[520px]">
                {/* Outer gold ring */}
                <div className="absolute inset-0 rounded-[2rem] border border-sage-gold/20" />

                {/* Main card */}
                <div className="absolute inset-4 rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-sage-surface-hover/80 via-sage-surface to-sage-black border border-sage-gold/15">
                  {/* Animated gold shimmer overlay */}
                  <div className="absolute inset-0 animate-shimmer-gold opacity-30" />

                  {/* Radial gold glow center */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-sage-gold/12 blur-[60px]" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-10">
                    {/* Monogram */}
                    <div className="relative">
                      <div className="text-8xl font-bold text-sage-gold/20 tracking-[-0.05em] font-display leading-none">
                        LPS
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl font-bold text-sage-gold/10 tracking-[-0.05em] font-display leading-none blur-sm">
                          LPS
                        </div>
                      </div>
                    </div>

                    {/* Decorative separator */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-sage-gold/40" />
                      <div className="h-1.5 w-1.5 rotate-45 bg-sage-gold/50" />
                      <div className="h-px w-12 bg-gradient-to-l from-transparent to-sage-gold/40" />
                    </div>

                    <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-sage-gold/45 font-light">
                      Perfumes de Ambiente
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-sage-gold/25">
                      Est. 2025
                    </p>

                    {/* Bottom accent lines */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-px w-4 bg-sage-gold/25" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent elements */}
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-sage-gold/10 blur-3xl" />
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-sage-gold/8 blur-2xl" />
                <div className="absolute top-12 -right-3 h-16 w-16 rounded-full bg-sage-gold/6 blur-xl animate-float" style={{ animationDelay: '2s' }} />
              </div>
            </AnimatedContent>
          </div>

          {/* Mobile decorative element */}
          <FadeContent duration={800} delay={400} className="lg:hidden flex justify-center">
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-sage-gold/40" />
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="text-xs tracking-[0.3em] text-sage-gold/40 uppercase font-display">
                Perfumes de Ambiente
              </div>
              <div className="h-2 w-2 rotate-45 bg-sage-gold/30" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-sage-gold/40" />
            </div>
          </FadeContent>
        </div>
      </div>

      {/* Scroll indicator */}
      <FadeContent duration={700} delay={700} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-sage-ivory/30">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-sage-gold/60 to-transparent animate-pulse-subtle" />
      </FadeContent>
    </section>
  );
}
