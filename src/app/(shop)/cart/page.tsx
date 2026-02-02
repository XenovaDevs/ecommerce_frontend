import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';

export const metadata: Metadata = {
  title: 'Carrito de compras',
  description: 'Tu carrito de compras',
};

/**
 * @ai-context Cart page showing items, quantities, and checkout button.
 *             TODO: Implement CartContext and actual cart functionality
 */

export default function CartPage() {
  // TODO: Get from cart context
  const cartItems: unknown[] = [];
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-20 w-20" />}
          title={UIMessages.CART.EMPTY}
          description="Agrega productos a tu carrito para continuar comprando"
          action={
            <Link href={ROUTES.PRODUCTS}>
              <Button size="xl" variant="gradient-sage">
                {UIMessages.CART.EMPTY_CTA}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">{UIMessages.CART.TITLE}</h1>
        <p className="mt-3 text-lg text-gray-600">
          Revisa tus productos antes de finalizar la compra
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-6 animate-slide-in-left">
          {/* Cart item placeholder */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} variant="elevated" hoverable className="group">
              <CardContent className="flex gap-6 p-6">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 animate-shimmer" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="h-5 w-48 animate-pulse rounded-lg bg-gray-200 mb-3" />
                      <div className="h-4 w-32 animate-pulse rounded-lg bg-gray-200" />
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-xl">
                        <span className="text-lg font-semibold">−</span>
                      </button>
                      <span className="w-12 text-center text-base font-bold text-gray-900">1</span>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-xl">
                        <span className="text-lg font-semibold">+</span>
                      </button>
                    </div>
                    <span className="text-xl font-bold text-gray-900">$0.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="pt-4">
            <Link href={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200">
              <ArrowRight className="h-4 w-4 rotate-180" />
              {UIMessages.CART.CONTINUE_SHOPPING}
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24 lg:h-fit animate-slide-in-right">
          <Card variant="glass" className="border-2 border-white/20 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {UIMessages.CHECKOUT.ORDER_SUMMARY}
              </h2>

              {/* Coupon input */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Código de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ingresa tu código"
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  />
                  <Button variant="outline" size="lg" className="shadow-sm">
                    Aplicar
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t-2 border-gray-100 pt-6">
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-600">{UIMessages.CART.SUBTOTAL}</span>
                  <span className="font-semibold text-gray-900">$0.000</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="font-medium text-gray-600">{UIMessages.CART.SHIPPING}</span>
                  <span className="font-semibold text-gray-900">A calcular</span>
                </div>

                {/* Free shipping progress */}
                <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Envío gratis desde $50.000</span>
                    <span className="text-xs font-medium text-primary">50%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/70 w-1/2 transition-all duration-500" />
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    Te faltan $25.000 para envío gratis
                  </p>
                </div>

                <div className="flex justify-between border-t-2 border-gray-100 pt-4">
                  <span className="text-xl font-bold text-gray-900">{UIMessages.CART.TOTAL}</span>
                  <span className="text-2xl font-bold text-primary">$0.000</span>
                </div>
              </div>

              <Button className="mt-8 w-full shadow-xl shadow-primary/20" size="xl" variant="gradient-sage">
                {UIMessages.CART.CHECKOUT}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-6 text-center text-sm text-gray-600 leading-relaxed">
                Impuestos incluidos. Envío calculado en el checkout.
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl">🔒</div>
                  <p className="mt-1 text-xs font-medium text-gray-600">Pago seguro</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">📦</div>
                  <p className="mt-1 text-xs font-medium text-gray-600">Envío rápido</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">↩️</div>
                  <p className="mt-1 text-xs font-medium text-gray-600">30 días devolución</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
