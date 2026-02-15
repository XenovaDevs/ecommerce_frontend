'use client';

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { APP_CONFIG } from '@/constants';
import AnimatedContent from '@/components/reactbits/Animations/AnimatedContent/AnimatedContent';

const features = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: `Compras +${APP_CONFIG.FREE_SHIPPING_MIN.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}`,
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Datos siempre protegidos',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pagos',
    description: 'Tarjetas y Mercado Pago',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

export function TrustBar() {
  return (
    <section className="relative border-b border-sage-gold/10 bg-sage-surface">
      {/* Subtle gold glow */}
      <div className="absolute inset-0 gradient-warm-glow opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex overflow-x-auto scrollbar-hide gap-6 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible">
          {features.map((feature, i) => (
            <AnimatedContent
              key={feature.title}
              distance={40}
              duration={0.6}
              delay={i * 0.1}
              ease="power3.out"
            >
              <div className="group flex flex-col items-center text-center min-w-[140px] md:min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-gold/25 text-sage-gold transition-all duration-300 group-hover:bg-sage-gold/10 group-hover:border-sage-gold/50 group-hover:shadow-gold-glow">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-sage-cream tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-xs text-sage-ivory/40">{feature.description}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
