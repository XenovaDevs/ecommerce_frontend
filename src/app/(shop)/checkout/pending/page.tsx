'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, Info } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';

/**
 * @ai-context Payment pending page shown when MercadoPago payment is awaiting confirmation.
 */

export const dynamic = 'force-dynamic';

function CheckoutPendingContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <Clock className="h-10 w-10 text-yellow-600" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pago pendiente
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
        </p>
        {orderNumber && (
          <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
            <span className="text-sm text-gray-600">Pedido:</span>
            <span className="text-sm font-semibold text-gray-900">
              {orderNumber}
            </span>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                ¿Qué significa esto?
              </h3>
              <p className="text-sm text-gray-600">
                Si elegiste pagar en efectivo (Rapipago, Pago Fácil, etc.),
                tu pago será confirmado automáticamente cuando lo realices.
                Recibirás un correo electrónico con la confirmación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={ROUTES.ORDERS} className="flex-1">
          <Button variant="outline" className="w-full">
            Ver mis pedidos
          </Button>
        </Link>
        <Link href={ROUTES.HOME} className="flex-1">
          <Button className="w-full">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-gray-200 rounded mx-auto" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <CheckoutPendingContent />
    </Suspense>
  );
}
