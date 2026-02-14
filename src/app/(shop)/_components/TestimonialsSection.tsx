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
          className={`h-4 w-4 ${i < rating ? 'text-sage-gold fill-sage-gold' : 'text-gray-300'}`}
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
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <AnimatedContent distance={40} duration={0.7} delay={0}>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
              Testimonios
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-sage-black tracking-tight font-display">
              Lo que dicen nuestros clientes
            </h2>
          </div>
        </AnimatedContent>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                className={`!bg-white !border-gray-100 !rounded-2xl !p-6 cursor-pointer transition-shadow duration-500 ${
                  i === active ? 'shadow-gold !border-sage-gold/30' : 'shadow-sm hover:shadow-elegant-lg'
                }`}
                spotlightColor="rgba(191, 155, 96, 0.12)"
              >
                <div onClick={() => setActive(i)}>
                  <Quote className="h-6 w-6 text-sage-gold/20 mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <StarRating rating={t.rating} />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-gold/10 text-sage-gold text-xs font-bold">
                      {t.initials}
                    </div>
                    <span className="text-sm font-medium text-sage-black">{t.name}</span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-sage-gold' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
