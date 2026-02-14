'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useInView } from '@/hooks/useInView';

const schema = z.object({
  email: z.email('Ingresá un email válido'),
});

type FormData = z.infer<typeof schema>;

export function NewsletterSection() {
  const { ref, isInView } = useInView();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--sage-gold)) 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className={`relative mx-auto max-w-xl px-6 text-center transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-gold">
          Newsletter
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-sage-white tracking-tight font-display">
          Recibí novedades exclusivas
        </h2>
        <p className="mt-3 text-gray-500 text-sm">
          Suscribite y obtené un <span className="text-sage-gold font-semibold">10% de descuento</span> en tu primera compra.
        </p>

        {status === 'success' ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-green-400 animate-fade-in">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">¡Te suscribiste exitosamente!</span>
          </div>
        ) : (
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
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
              className="shrink-0"
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

        <p className="mt-4 text-[11px] text-gray-600">
          Sin spam. Podés desuscribirte cuando quieras.
        </p>
      </div>
    </section>
  );
}
