import Link from 'next/link';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES, APP_CONFIG } from '@/constants';
import { FeaturedProducts, CategoriesSection } from './(shop)/_components';

/**
 * @ai-context Home page with hero section, dynamic featured products, and categories.
 */

const features = [
  {
    icon: Truck,
    title: 'Envio gratis',
    description: `En compras mayores a ${APP_CONFIG.FREE_SHIPPING_MIN.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
  },
  {
    icon: Shield,
    title: 'Compra segura',
    description: 'Tus datos siempre protegidos',
  },
  {
    icon: CreditCard,
    title: 'Multiples pagos',
    description: 'Tarjetas, Mercado Pago y mas',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-transparent overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-radial opacity-50" />
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            <div className="animate-slide-up">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
                Bienvenido a{' '}
                <span className="text-gradient bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {APP_CONFIG.SITE_NAME}
                </span>
              </h1>
            </div>
            <p className="mt-8 text-xl text-gray-600 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Descubre nuestra coleccion de productos de alta calidad. Envio a todo el pais con las mejores opciones de pago.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href={ROUTES.PRODUCTS}>
                <Button size="xl" variant="gradient-sage">
                  Ver productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES}>
                <Button variant="outline" size="xl">
                  Explorar categorias
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-base font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Productos destacados
              </h2>
              <p className="mt-2 text-gray-600">
                Lo mejor de nuestra coleccion
              </p>
            </div>
            <Link
              href={ROUTES.PRODUCTS}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200 group"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <FeaturedProducts />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Explora por categoria
            </h2>
            <p className="mt-3 text-gray-600">
              Encuentra exactamente lo que buscas
            </p>
          </div>

          <CategoriesSection />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass border border-white/20 rounded-3xl px-8 py-16 text-center sm:px-16 shadow-2xl">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Suscribete a nuestro newsletter
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Recibe ofertas exclusivas, lanzamientos anticipados y novedades directamente en tu email.
              </p>
            </div>
            <form className="mx-auto mt-8 flex max-w-md gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              />
              <Button type="submit" size="lg" variant="gradient-sage">
                Suscribirse
              </Button>
            </form>
            <p className="mt-4 text-xs text-gray-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Puedes cancelar tu suscripcion en cualquier momento
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
