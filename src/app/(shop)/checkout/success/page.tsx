'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { checkoutService } from '@/features/checkout/services';
import type { Order } from '@/features/checkout/types';
import { formatCurrency } from '@/lib/utils';

/**
 * @ai-context Order success page shown after successful checkout.
 *             Displays order confirmation and details.
 */

export const dynamic = 'force-dynamic';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No se encontró el número de pedido');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await checkoutService.getOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('No se pudo cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Error al cargar el pedido
        </h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link href={ROUTES.HOME}>
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Success Icon */}
      <div className="mb-8 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Gracias por tu compra. Hemos recibido tu pedido.
        </p>
        <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
          <span className="text-sm text-gray-600">Número de pedido:</span>
          <span className="text-sm font-semibold text-gray-900">
            {order.order_number}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles del pedido
          </h2>

          {/* Order Items */}
          <div className="mb-6 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatCurrency(order.totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium">
                {order.totals.shipping === 0
                  ? 'Gratis'
                  : formatCurrency(order.totals.shipping)}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">
                  {formatCurrency(order.totals.total)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dirección de envío
          </h2>
          <address className="not-italic text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            <p>
              {order.shipping_address.street} {order.shipping_address.number}
            </p>
            {order.shipping_address.apartment && (
              <p>Piso/Depto: {order.shipping_address.apartment}</p>
            )}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state}
            </p>
            <p>CP: {order.shipping_address.postal_code}</p>
            <p>País: {order.shipping_address.country}</p>
            <p className="mt-2">{order.shipping_address.phone}</p>
          </address>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Package className="h-6 w-6 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                ¿Qué sigue?
              </h3>
              <p className="text-sm text-gray-600">
                Te enviaremos un correo electrónico con la confirmación de tu
                pedido y el número de seguimiento cuando tu pedido sea enviado.
                Puedes ver el estado de tu pedido en cualquier momento desde tu
                cuenta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={ROUTES.ORDERS} className="flex-1">
          <Button variant="outline" className="w-full">
            Ver mis pedidos
          </Button>
        </Link>
        <Link href={ROUTES.PRODUCTS} className="flex-1">
          <Button className="w-full">
            Seguir comprando
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-gray-200 rounded mx-auto" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
