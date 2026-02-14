'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

function AnimatedCounter({ target, suffix = '', isInView }: { target: number; suffix?: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isInView, target]);

  return <span>{count}{suffix}</span>;
}

export function BrandStory() {
  const { ref, isInView } = useInView();

  const stats = [
    { value: 100, suffix: '%', label: 'Calidad garantizada' },
    { value: 24, suffix: 'hs', label: 'Despacho rápido' },
    { value: 5, suffix: '★', label: 'Satisfacción' },
  ];

  return (
    <section className="relative overflow-hidden bg-sage-black py-24 sm:py-32">
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
          <div
            className={`transition-all duration-700 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
              Nuestra filosofía
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-sage-white tracking-tight leading-[1.1] font-display">
              La esencia de
              <br />
              <span className="text-gradient-gold">lo auténtico</span>
            </h2>

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

            <div className="mt-10 flex flex-wrap gap-10">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-sage-gold font-display">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} isInView={isInView} />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative transition-all duration-700 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative mx-auto max-w-sm">
              <div className="aspect-[3/4] rounded-2xl border border-sage-gold/15 p-4">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-sage-black flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 animate-shimmer-gold opacity-20" />
                  <div className="relative p-8 text-center">
                    <Star className="h-6 w-6 text-sage-gold/40 mx-auto" strokeWidth={1} />
                    <p className="mt-4 text-gray-400 italic text-sm leading-relaxed font-display">
                      &ldquo;Lo simple es la máxima sofisticación&rdquo;
                    </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
