'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, CreditCard, Package, Truck } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { checkoutService } from '@/features/checkout/services';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import type { Order, OrderStatus } from '@/features/checkout/types';
import React from 'react';

/**
 * @ai-context Order detail page showing complete order information.
 */

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }
> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  processing: { label: 'Procesando', variant: 'default' },
  confirmed: { label: 'Confirmado', variant: 'success' },
  shipped: { label: 'Enviado', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
  refunded: { label: 'Reembolsado', variant: 'warning' },
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await checkoutService.getOrder(resolvedParams.id);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('No se pudo cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error al cargar el pedido
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href={ROUTES.ORDERS}>
          <Button variant="outline">Volver a mis pedidos</Button>
        </Link>
      </div>
    );
  }

  const config = statusConfig[order.status];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={ROUTES.ORDERS}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver a mis pedidos
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido #{order.order_number}
            </h1>
            <p className="text-sm text-gray-600">
              Realizado el{' '}
              {new Date(order.created_at).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Productos ({order.items.length})
                </h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                        <span>Cantidad: {item.quantity}</span>
                        <span>Precio: {formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Dirección de envío
                </h2>
              </div>
              <address className="not-italic text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">
                  {order.shipping_address?.name}
                </p>
                <p>{order.shipping_address?.address}</p>
                {order.shipping_address?.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address?.city}
                  {order.shipping_address?.state && `, ${order.shipping_address.state}`}
                </p>
                <p>CP: {order.shipping_address?.postal_code}</p>
                <p>País: {order.shipping_address?.country}</p>
                {order.shipping_address?.phone && (
                  <p className="mt-2">{order.shipping_address.phone}</p>
                )}
              </address>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          {order.tracking_number && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Información de envío
                  </h2>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Número de seguimiento:</p>
                  <p className="font-medium text-gray-900">
                    {order.tracking_number}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {order.shipping_cost === 0
                      ? 'Gratis'
                      : formatCurrency(order.shipping_cost)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Método de pago
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                {order.payment_method || 'Mercado Pago'}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          {order.status === 'pending' && (
            <Button variant="outline" className="w-full">
              Cancelar pedido
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
