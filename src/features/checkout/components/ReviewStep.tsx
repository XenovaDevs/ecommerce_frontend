'use client';

import { MapPin, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/features/cart';
import type { ShippingAddress, ShippingOption, PaymentMethod } from '../types';

/**
 * @ai-context Review step showing order summary before confirmation.
 */

interface ReviewStepProps {
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  onConfirm: () => void;
  onBack: () => void;
  onEditShipping: () => void;
  onEditPayment: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function ReviewStep({
  shippingAddress,
  shippingOption,
  paymentMethod,
  onConfirm,
  onBack,
  onEditShipping,
  onEditPayment,
  isLoading = false,
  error,
}: ReviewStepProps) {
  const { items, totals } = useCart();

  const finalTotal = totals.subtotal + shippingOption.price;

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Order Items */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ShoppingBag className="h-5 w-5" />
              Productos ({items.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant.name}</p>
                  )}
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5" />
              Dirección de envío
            </h2>
            <button
              onClick={onEditShipping}
              className="text-sm text-primary hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">
              {shippingAddress.first_name} {shippingAddress.last_name}
            </p>
            <p>
              {shippingAddress.street} {shippingAddress.number}
              {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
            </p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
            </p>
            <p>{shippingAddress.phone}</p>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Truck className="h-5 w-5" />
              Método de envío
            </h2>
            <button
              onClick={onEditShipping}
              className="text-sm text-primary hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{shippingOption.name}</p>
              <p className="text-sm text-gray-500">
                Entrega estimada: {shippingOption.estimated_days} día(s)
              </p>
            </div>
            <p className="font-medium text-gray-900">
              {shippingOption.price === 0 ? 'Gratis' : formatCurrency(shippingOption.price)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <CreditCard className="h-5 w-5" />
              Método de pago
            </h2>
            <button
              onClick={onEditPayment}
              className="text-sm text-primary hover:underline"
            >
              Editar
            </button>
          </div>

          <p className="font-medium text-gray-900">{paymentMethod.name}</p>
          {paymentMethod.description && (
            <p className="text-sm text-gray-500">{paymentMethod.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Resumen del pedido
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span>
                {shippingOption.price === 0 ? 'Gratis' : formatCurrency(shippingOption.price)}
              </span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button
          onClick={onConfirm}
          isLoading={isLoading}
          size="lg"
        >
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
}
