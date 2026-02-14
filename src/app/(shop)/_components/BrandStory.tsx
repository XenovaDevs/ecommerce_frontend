'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const stats = [
    { value: 100, suffix: '%', label: 'Calidad garantizada' },
    { value: 24, suffix: 'hs', label: 'Despacho rápido' },
    { value: 5, suffix: '★', label: 'Satisfacción' },
  ];

  return (
    <section className="relative overflow-hidden bg-sage-black py-24 sm:py-32">
      {/* Particles background - desktop only */}
      {isDesktop && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Particles
            particleCount={40}
            particleSpread={8}
            speed={0.05}
            particleColors={['#BF9B60', '#D9BF91', '#A58146']}
            particleBaseSize={60}
            sizeRandomness={0.5}
            alphaParticles
            moveParticlesOnHover
            particleHoverFactor={0.3}
          />
        </div>
      )}

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 0.5px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                  className="text-sage-white block"
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

              <div className="mt-6 h-px w-16 bg-gradient-to-r from-sage-gold to-transparent" />

              <p className="mt-6 text-gray-400 leading-relaxed text-base lg:text-lg">
                En Le Pas Sage creemos que cada producto cuenta una historia.
                Seleccionamos cuidadosamente cada artículo para ofrecerte lo mejor
                en calidad, diseño y experiencia.
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed text-base">
                Nuestra misión es simple: acercar productos excepcionales a
                quienes valoran la diferencia entre lo común y lo extraordinario.
              </p>

              {/* Animated Counters */}
              <div className="mt-10 flex flex-wrap gap-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-baseline text-2xl sm:text-3xl font-bold text-sage-gold font-display">
                      <Counter
                        value={isInView ? stat.value : 0}
                        fontSize={28}
                        padding={0}
                        gap={2}
                        textColor="rgb(191, 155, 96)"
                        gradientFrom="rgb(15, 15, 15)"
                        gradientTo="transparent"
                        gradientHeight={4}
                      />
                      <span className="ml-0.5">{stat.suffix}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeContent>

          {/* Right column */}
          <FadeContent blur duration={800} delay={200}>
            <div className="relative mx-auto max-w-sm">
              <div className="aspect-[3/4] rounded-2xl border border-sage-gold/15 p-4">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-sage-black flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 animate-shimmer-gold opacity-20" />
                  <div className="relative p-8 text-center">
                    <Star className="h-6 w-6 text-sage-gold/40 mx-auto" strokeWidth={1} />
                    <div className="mt-4">
                      <DecryptedText
                        text="Lo simple es la máxima sofisticación"
                        animateOn="view"
                        sequential
                        speed={30}
                        revealDirection="start"
                        className="text-gray-400 italic text-sm leading-relaxed font-display"
                        encryptedClassName="text-sage-gold/30 italic text-sm leading-relaxed font-display"
                        parentClassName="inline"
                      />
                    </div>
                    <div className="mt-4 h-px w-8 mx-auto bg-sage-gold/30" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-sage-gold/50">
                      Leonardo da Vinci
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage-gold/5 blur-3xl" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-sage-gold/5 blur-2xl" />
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
