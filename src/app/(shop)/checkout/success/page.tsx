'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { checkoutService } from '@/features/checkout/services';
import type { Order } from '@/features/checkout/types';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No se encontro el numero de pedido');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = isAuthenticated
          ? await checkoutService.getOrderByNumber(orderNumber)
          : await checkoutService.getGuestOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('No se pudo cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, isAuthenticated, authLoading]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 rounded bg-sage-surface-light" />
          <div className="h-64 rounded bg-sage-surface-light" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-sage-cream">Error al cargar el pedido</h1>
        <p className="mb-8 text-sage-ivory/55">{error}</p>
        <Link href={ROUTES.HOME}>
          <Button variant="gold">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-10 h-[400px] w-[400px] rounded-full bg-sage-gold/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
            <CheckCircle className="h-10 w-10 text-green-300" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 font-display text-3xl font-bold text-sage-cream">Pedido confirmado</h1>
          <p className="mb-4 text-lg text-sage-ivory/55">
            Gracias por tu compra. Hemos recibido tu pedido.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-sage-surface-hover bg-sage-surface px-4 py-2">
            <span className="text-sm text-sage-ivory/55">Numero de pedido:</span>
            <span className="text-sm font-semibold text-sage-cream">{order.order_number}</span>
          </div>
        </div>

        <Card className="mb-6 border border-sage-surface-light bg-sage-surface">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-sage-cream">Detalles del pedido</h2>

            <div className="mb-6 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sage-cream">{item.name}</p>
                    <p className="text-sm text-sage-ivory/45">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sage-cream">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-sage-surface-hover pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-sage-ivory/55">Subtotal</span>
                <span className="font-medium text-sage-cream">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-300">
                  <span>Descuento</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sage-ivory/55">Envio</span>
                <span className="font-medium text-sage-cream">
                  {order.shipping_cost === 0
                    ? 'Gratis'
                    : formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <div className="border-t border-sage-surface-hover pt-2">
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-sage-cream">Total</span>
                  <span className="font-bold text-sage-gold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.shipping_address && (
          <Card className="mb-6 border border-sage-surface-light bg-sage-surface">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-sage-cream">Direccion de envio</h2>
              <address className="not-italic text-sm text-sage-ivory/55">
                <p className="mb-1 font-medium text-sage-cream">{order.shipping_address.name}</p>
                <p>{order.shipping_address.address}</p>
                {order.shipping_address.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address.city}
                  {order.shipping_address.state && `, ${order.shipping_address.state}`}
                </p>
                <p>CP: {order.shipping_address.postal_code}</p>
                <p>Pais: {order.shipping_address.country}</p>
                {order.shipping_address.phone && (
                  <p className="mt-2">{order.shipping_address.phone}</p>
                )}
              </address>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 border border-sage-surface-light bg-sage-surface">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Package className="mt-0.5 h-6 w-6 text-sage-gold" />
              <div>
                <h3 className="mb-1 font-semibold text-sage-cream">Que sigue?</h3>
                <p className="text-sm text-sage-ivory/55">
                  Te enviaremos un correo electronico con la confirmacion de tu pedido y el numero
                  de seguimiento cuando tu pedido sea enviado. Puedes ver el estado de tu pedido en
                  cualquier momento desde tu cuenta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={isAuthenticated ? ROUTES.ORDERS : ROUTES.HOME} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
            >
              {isAuthenticated ? 'Ver mis pedidos' : 'Volver al inicio'}
            </Button>
          </Link>
          <Link href={ROUTES.PRODUCTS} className="flex-1">
            <Button className="w-full" variant="gold">
              Seguir comprando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-64 rounded bg-sage-surface-light" />
          <div className="h-64 rounded bg-sage-surface-light" />
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
