'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCountdown } from '@/hooks/useCountdown';
import { ROUTES } from '@/constants';
import GradientText from '@/components/reactbits/TextAnimations/GradientText/GradientText';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import StarBorder from '@/components/reactbits/Animations/StarBorder/StarBorder';

// Promo end: 7 days from now (can be configured)
const PROMO_END = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-sage-gold/10 border border-sage-gold/20">
        <span className="text-lg sm:text-xl font-bold text-sage-gold font-display">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1.5 text-[10px] uppercase tracking-wider text-gray-500">{label}</span>
    </div>
  );
}

export function PromoBanner() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(PROMO_END);

  if (isExpired) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sage-black via-gray-900 to-sage-black py-16 sm:py-20">
      {/* Gold accent glow */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
        <AnimatedContent distance={30} duration={0.6} delay={0}>
          <div className="flex justify-center mb-6">
            <StarBorder
              as="div"
              color="rgb(191, 155, 96)"
              speed="4s"
              className="!rounded-full"
            >
              <div className="flex items-center gap-2 !bg-transparent !border-0 !py-1 !px-3 !rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-sage-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-gold">
                  Oferta especial
                </span>
              </div>
            </StarBorder>
          </div>
        </AnimatedContent>

        <AnimatedContent distance={40} duration={0.7} delay={0.1}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sage-white tracking-tight leading-[1.1] font-display">
            Hasta{' '}
            <GradientText
              colors={['#A58146', '#D9BF91', '#BF9B60', '#D9BF91', '#A58146']}
              animationSpeed={4}
              className="inline"
            >
              30% OFF
            </GradientText>
            <br />
            en productos seleccionados
          </h2>
        </AnimatedContent>

        <AnimatedContent distance={30} duration={0.6} delay={0.2}>
          <p className="mt-4 text-gray-400 text-base max-w-lg mx-auto">
            Aprovechá descuentos exclusivos por tiempo limitado en nuestra selección premium.
          </p>
        </AnimatedContent>

        {/* Countdown */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
          {[
            { value: days, label: 'Días' },
            { value: hours, label: 'Horas' },
            { value: minutes, label: 'Min' },
            { value: seconds, label: 'Seg' },
          ].map((unit, i) => (
            <AnimatedContent key={unit.label} distance={30} duration={0.5} delay={0.3 + i * 0.08}>
              <div className="flex items-center gap-3 sm:gap-4">
                <CountdownUnit value={unit.value} label={unit.label} />
                {i < 3 && (
                  <span className="text-sage-gold/40 text-xl font-light mt-[-16px]">:</span>
                )}
              </div>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent distance={20} duration={0.6} delay={0.5}>
          <div className="mt-8">
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="gold" size="lg" className="group">
                Ver ofertas
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
