'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import BlurText from '@/components/reactbits/TextAnimations/BlurText/BlurText';
import FadeContent from '@/components/reactbits/Animations/FadeContent/FadeContent';

const Aurora = dynamic(
  () => import('@/components/reactbits/Backgrounds/Aurora/Aurora'),
  { ssr: false }
);

const schema = z.object({
  email: z.email('Ingresá un email válido'),
});

type FormData = z.infer<typeof schema>;

export function NewsletterSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      // Simulated API call - replace with actual newsletter endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-sage-black py-20 sm:py-24">
      {/* Aurora Background - desktop only */}
      {isDesktop && (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <Aurora
            colorStops={['#BF9B60', '#A58146', '#D9BF91']}
            amplitude={0.6}
            blend={0.7}
            speed={0.3}
          />
        </div>
      )}

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-xl px-6 text-center">
        <FadeContent blur duration={600} delay={0}>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
            Newsletter
          </span>
        </FadeContent>

        <div className="mt-3">
          <BlurText
            text="Recibí novedades exclusivas"
            className="text-2xl sm:text-3xl font-bold text-sage-white tracking-tight font-display justify-center"
            delay={50}
            animateBy="words"
            direction="bottom"
          />
        </div>

        <FadeContent duration={700} delay={200}>
          <p className="mt-3 text-gray-500 text-sm">
            Suscribite y obtené un <span className="text-sage-gold font-semibold">10% de descuento</span> en tu primera compra.
          </p>
        </FadeContent>

        <FadeContent duration={700} delay={300}>
          <div>
            {status === 'success' ? (
              <div className="mt-8 flex items-center justify-center gap-2 text-green-400 animate-fade-in">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">¡Te suscribiste exitosamente!</span>
              </div>
            ) : (
              <form
                className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email', { required: 'El email es requerido' })}
                    className={`w-full rounded-lg border bg-gray-900/50 px-4 py-3 text-sm text-sage-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-colors ${
                      errors.email
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30'
                        : 'border-gray-700 focus:border-sage-gold/50 focus:ring-sage-gold/30'
                    }`}
                    aria-label="Email para newsletter"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400 text-left">{errors.email.message}</p>
                  )}
                </div>
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto sm:shrink-0"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Suscribirse
                    </>
                  )}
                </Button>
              </form>
            )}

            {status === 'error' && (
              <div className="mt-3 flex items-center justify-center gap-2 text-red-400 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">Ocurrió un error. Intentá de nuevo.</span>
              </div>
            )}
          </div>
        </FadeContent>

        <FadeContent duration={600} delay={400}>
          <p className="mt-4 text-[11px] text-gray-600">
            Sin spam. Podés desuscribirte cuando quieras.
          </p>
        </FadeContent>
      </div>
    </section>
  );
}
