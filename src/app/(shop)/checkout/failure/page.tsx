'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { checkoutService } from '@/features/checkout/services';
import type { Order } from '@/features/checkout/types';

export const dynamic = 'force-dynamic';

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No se encontro el numero de pedido.');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = isAuthenticated
          ? await checkoutService.getOrderByNumber(orderNumber)
          : await checkoutService.getGuestOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch {
        setError('No se pudo cargar el estado del pedido.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [authLoading, isAuthenticated, orderNumber]);

  const canRetryPayment = order?.payment_status === 'pending' && order.status !== 'cancelled';

  const handleRetryPayment = async () => {
    if (!order) return;

    setIsRetrying(true);
    setError(null);

    try {
      const preference = isAuthenticated
        ? await checkoutService.createPaymentPreference(order.id)
        : await checkoutService.createGuestPaymentPreference(order.order_number);

      window.location.href = preference.init_point;
    } catch {
      setError('No se pudo generar un nuevo link de pago para este pedido.');
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-64 rounded bg-sage-surface-light" />
          <div className="h-64 rounded bg-sage-surface-light" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
          <XCircle className="h-10 w-10 text-red-300" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold text-sage-cream">Pago no procesado</h1>
        <p className="mb-4 text-lg text-sage-ivory/55">
          Lo sentimos, no pudimos procesar tu pago. Por favor intenta nuevamente o elige otro medio de pago.
        </p>
        {order?.order_number && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-sage-surface-hover bg-sage-surface px-4 py-2">
            <span className="text-sm text-sage-ivory/55">Pedido:</span>
            <span className="text-sm font-semibold text-sage-cream">{order.order_number}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/25 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <Card className="mb-8 border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <RefreshCw className="mt-0.5 h-6 w-6 text-sage-gold" />
            <div>
              <h3 className="mb-1 font-semibold text-sage-cream">Que puedo hacer?</h3>
              <ul className="list-disc space-y-1 pl-4 text-sm text-sage-ivory/55">
                <li>Verifica que los datos de tu tarjeta sean correctos</li>
                <li>Intenta con otro medio de pago</li>
                <li>Contacta a tu banco si el problema persiste</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        {canRetryPayment && (
          <Button
            className="flex-1"
            variant="gold"
            isLoading={isRetrying}
            onClick={handleRetryPayment}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar pago
          </Button>
        )}
        <Link
          href={order?.order_number ? `${ROUTES.CHECKOUT_SUCCESS}?order=${order.order_number}` : ROUTES.HOME}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
          >
            Ver estado de mi pedido
          </Button>
        </Link>
        <Link href={isAuthenticated ? ROUTES.ORDERS : ROUTES.HOME} className="flex-1">
          <Button className="w-full" variant={isAuthenticated ? 'outline' : 'gold'}>
            {isAuthenticated ? 'Ver mis pedidos' : 'Volver al inicio'}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-12 w-64 rounded bg-sage-surface-light" />
          <div className="h-64 rounded bg-sage-surface-light" />
        </div>
      </div>
    }>
      <CheckoutFailureContent />
    </Suspense>
  );
}
