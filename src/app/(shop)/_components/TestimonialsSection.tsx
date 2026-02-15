'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';
import SpotlightCard from '@/components/reactbits/Components/SpotlightCard/SpotlightCard';

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'María García',
    text: 'La calidad de los productos superó mis expectativas. El empaque es impecable y la atención al cliente excelente.',
    rating: 5,
    initials: 'MG',
  },
  {
    name: 'Lucas Fernández',
    text: 'Compro hace meses acá y siempre me sorprenden. Envío rápido, productos premium y precios justos.',
    rating: 5,
    initials: 'LF',
  },
  {
    name: 'Valentina López',
    text: 'Le regalé a mi mamá y quedó encantada. Definitivamente voy a seguir comprando en Le Pas Sage.',
    rating: 5,
    initials: 'VL',
  },
  {
    name: 'Tomás Ruiz',
    text: 'Increíble experiencia de compra de principio a fin. La selección de productos es única.',
    rating: 5,
    initials: 'TR',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'text-sage-gold fill-sage-gold' : 'text-sage-surface-hover'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPaused, next]);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-sage-surface">
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--sage-gold)) 0.5px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-sage-gold/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <AnimatedContent distance={40} duration={0.7} delay={0}>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
              Testimonios
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-sage-cream tracking-tight font-display">
              Lo que dicen nuestros clientes
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-sage-gold/40" />
              <div className="h-1.5 w-1.5 rotate-45 bg-sage-gold" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-sage-gold/40" />
            </div>
          </div>
        </AnimatedContent>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonials.map((t, i) => (
            <AnimatedContent
              key={t.name}
              distance={50}
              duration={0.6}
              delay={i * 0.1}
            >
              <SpotlightCard
                className={`!bg-sage-surface-light !rounded-2xl !p-6 cursor-pointer transition-all duration-500 !border ${
                  i === active
                    ? '!border-sage-gold/30 shadow-gold'
                    : '!border-sage-surface-hover shadow-sm hover:shadow-gold-glow hover:!border-sage-gold/15'
                }`}
                spotlightColor="rgba(201, 165, 106, 0.08)"
              >
                <div onClick={() => setActive(i)}>
                  <Quote className="h-5 w-5 text-sage-gold/25 mb-4" />
                  <p className="text-sm text-sage-ivory/60 leading-relaxed mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <StarRating rating={t.rating} />
                  <div className="mt-4 pt-4 border-t border-sage-surface-hover flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-gold/15 text-sage-gold text-xs font-bold">
                      {t.initials}
                    </div>
                    <span className="text-sm font-medium text-sage-cream">{t.name}</span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-sage-gold' : 'w-1.5 bg-sage-surface-hover hover:bg-sage-gold/30'
              }`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
