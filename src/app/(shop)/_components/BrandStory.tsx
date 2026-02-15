'use client';

import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import SplitText from '@/components/reactbits/TextAnimations/SplitText/SplitText';
import DecryptedText from '@/components/reactbits/TextAnimations/DecryptedText/DecryptedText';
import FadeContent from '@/components/reactbits/Animations/FadeContent/FadeContent';
import Counter from '@/components/reactbits/Components/Counter/Counter';

const Particles = dynamic(
  () => import('@/components/reactbits/Backgrounds/Particles/Particles'),
  { ssr: false }
);

export function BrandStory() {
  const { ref, isInView } = useInView();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const stats = [
    { value: 100, suffix: '%', label: 'Calidad garantizada' },
    { value: 24, suffix: 'hs', label: 'Despacho rápido' },
    { value: 5, suffix: '★', label: 'Satisfacción' },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-28 sm:py-36">
      {/* Particles background - desktop only */}
      {isDesktop && (
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <Particles
            particleCount={40}
            particleSpread={8}
            speed={0.05}
            particleColors={['#C9A56A', '#E3C99B', '#A58146']}
            particleBaseSize={60}
            sizeRandomness={0.5}
            alphaParticles
            moveParticlesOnHover
            particleHoverFactor={0.3}
          />
        </div>
      )}

      {/* Atmospheric orbs */}
      <div className="absolute top-[10%] left-[20%] h-80 w-80 rounded-full bg-sage-gold/[0.05] blur-[100px]" />
      <div className="absolute bottom-[10%] right-[10%] h-60 w-60 rounded-full bg-sage-gold/[0.07] blur-[80px]" />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 0.5px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left column */}
          <FadeContent blur duration={800} delay={0}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
                Nuestra filosofía
              </span>

              <div className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] font-display">
                <SplitText
                  text="La esencia de"
                  tag="span"
                  className="text-sage-cream block"
                  delay={80}
                  duration={0.8}
                  splitType="words"
                  textAlign="left"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                />
                <SplitText
                  text="lo auténtico"
                  tag="span"
                  className="text-sage-gold block"
                  delay={80}
                  duration={0.8}
                  splitType="words"
                  textAlign="left"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                />
              </div>

              {/* Gold accent line */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-sage-gold to-transparent" />
                <div className="h-1 w-1 rotate-45 bg-sage-gold/50" />
              </div>

              <p className="mt-6 text-sage-ivory/60 leading-relaxed text-base lg:text-lg max-w-lg">
                En Le Pas Sage creemos que cada fragancia cuenta una historia.
                Seleccionamos cuidadosamente cada aroma para ofrecerte lo mejor
                en calidad, diseño y experiencia sensorial.
              </p>
              <p className="mt-4 text-sage-ivory/45 leading-relaxed text-base max-w-lg">
                Nuestra misión: acercar fragancias excepcionales a
                quienes valoran la diferencia entre lo común y lo extraordinario.
              </p>

              {/* Animated Counters */}
              <div className="mt-12 flex flex-wrap gap-12">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-baseline text-2xl sm:text-3xl font-bold text-sage-gold font-display">
                      <Counter
                        value={isInView ? stat.value : 0}
                        fontSize={28}
                        padding={0}
                        gap={2}
                        textColor="rgb(201, 165, 106)"
                        gradientFrom="rgb(10, 10, 12)"
                        gradientTo="transparent"
                        gradientHeight={4}
                      />
                      <span className="ml-0.5">{stat.suffix}</span>
                    </div>
                    <div className="mt-1.5 text-xs text-sage-ivory/40 tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeContent>

          {/* Right column - Quote card */}
          <FadeContent blur duration={800} delay={200}>
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              {/* Outer decorative frame */}
              <div className="aspect-[3/4] rounded-2xl border border-sage-gold/20 p-5">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-sage-surface-hover/60 via-sage-surface to-sage-black flex items-center justify-center overflow-hidden relative border border-sage-gold/10">
                  {/* Shimmer */}
                  <div className="absolute inset-0 animate-shimmer-gold opacity-25" />

                  {/* Radial glow */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-sage-gold/10 blur-[40px]" />

                  {/* Content */}
                  <div className="relative p-8 sm:p-10 text-center">
                    <Star className="h-6 w-6 text-sage-gold/35 mx-auto" strokeWidth={1} />
                    <div className="mt-6">
                      <DecryptedText
                        text="Lo simple es la máxima sofisticación"
                        animateOn="view"
                        sequential
                        speed={30}
                        revealDirection="start"
                        className="text-sage-ivory/60 italic text-sm sm:text-base leading-relaxed font-accent"
                        encryptedClassName="text-sage-gold/30 italic text-sm sm:text-base leading-relaxed font-accent"
                        parentClassName="inline"
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <div className="h-px w-8 bg-sage-gold/25" />
                      <div className="h-1 w-1 rotate-45 bg-sage-gold/35" />
                      <div className="h-px w-8 bg-sage-gold/25" />
                    </div>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-sage-gold/45">
                      Leonardo da Vinci
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating accents */}
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage-gold/6 blur-3xl" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-sage-gold/6 blur-2xl" />
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
