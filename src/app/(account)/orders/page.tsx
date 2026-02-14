'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Badge, Card, CardContent } from '@/components/ui';
import { useOrders } from '@/features/checkout/hooks';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import type { OrderStatus } from '@/features/checkout/types';

/**
 * @ai-context Orders list page showing user's order history.
 */

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

export default function OrdersPage() {
  const { orders, isLoading, error, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              Error al cargar los pedidos
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h2>
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes pedidos
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices un pedido, aparecerá aquí
            </p>
            <Link href={ROUTES.PRODUCTS}>
              <button className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                Ir a la tienda
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis pedidos</h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status];

          return (
            <Link key={order.id} href={ROUTES.ORDER_DETAIL(order.id.toString())}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      {/* Order Number and Date */}
                      <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="font-semibold text-gray-900">
                          Pedido #{order.order_number}
                        </h3>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>

                      {/* Order Info */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Fecha:{' '}
                          {new Date(order.created_at).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p>
                          {order.items.length} producto
                          {order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-3 space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm text-gray-700">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            y {order.items.length - 2} más...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total and Arrow */}
                    <div className="flex flex-row items-center justify-between sm:h-full sm:flex-col sm:items-end">
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 sm:mt-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
