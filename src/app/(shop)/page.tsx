import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/constants';

/**
 * @ai-context Home page with hero section, features, and categories.
 */

const features = [
  {
    icon: Truck,
    title: 'Envío gratis',
    description: `En compras mayores a ${APP_CONFIG.FREE_SHIPPING_MIN.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Tus datos siempre protegidos',
  },
  {
    icon: CreditCard,
    title: 'Múltiples pagos',
    description: 'Tarjetas, Mercado Pago y más',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Bienvenido a{' '}
              <span className="text-primary">{APP_CONFIG.SITE_NAME}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Descubre nuestra colección de productos de alta calidad. Envío a todo el país con las mejores opciones de pago.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg">
                  Ver productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES}>
                <Button variant="outline" size="lg">
                  Explorar categorías
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Productos destacados
            </h2>
            <Link
              href={ROUTES.PRODUCTS}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Product grid placeholder */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Placeholder */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Explora por categoría
          </h2>

          {/* Categories grid placeholder */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary/5 px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Suscríbete a nuestro newsletter
            </h2>
            <p className="mt-2 text-gray-600">
              Recibe ofertas exclusivas y novedades directamente en tu email.
            </p>
            <form className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit">Suscribirse</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
