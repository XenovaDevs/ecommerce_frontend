'use client';

import { Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { APP_CONFIG } from '@/constants';
import { useInView } from '@/hooks/useInView';

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
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative border-b border-gray-200 bg-sage-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex overflow-x-auto scrollbar-hide gap-6 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group flex flex-col items-center text-center min-w-[140px] md:min-w-0 transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sage-gold/30 text-sage-gold transition-all duration-300 group-hover:bg-sage-gold/10 group-hover:border-sage-gold/50">
                <feature.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-sage-black tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
