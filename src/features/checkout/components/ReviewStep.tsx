'use client';

import { MapPin, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/features/cart';
import type { ShippingAddressForm, ShippingOption, PaymentMethod } from '../types';

interface ReviewStepProps {
  shippingAddress: ShippingAddressForm;
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
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-950/25 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-sage-cream">
              <ShoppingBag className="h-5 w-5 text-sage-gold" />
              Productos ({items.length})
            </h2>
          </div>

          <div className="divide-y divide-sage-surface-hover">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-sage-surface-light">
                  {item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sage-ivory/40">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-sage-cream">{item.product.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-sage-ivory/45">{item.variant.name}</p>
                  )}
                  <p className="text-sm text-sage-ivory/45">Cantidad: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-sage-cream">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-sage-cream">
              <MapPin className="h-5 w-5 text-sage-gold" />
              Direccion de envio
            </h2>
            <button onClick={onEditShipping} className="text-sm text-sage-gold hover:underline">
              Editar
            </button>
          </div>

          <div className="text-sm text-sage-ivory/55">
            <p className="font-medium text-sage-cream">
              {shippingAddress.first_name} {shippingAddress.last_name}
            </p>
            <p>{shippingAddress.email}</p>
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

      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-sage-cream">
              <Truck className="h-5 w-5 text-sage-gold" />
              Metodo de envio
            </h2>
            <button onClick={onEditShipping} className="text-sm text-sage-gold hover:underline">
              Editar
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sage-cream">{shippingOption.name}</p>
              <p className="text-sm text-sage-ivory/45">
                Entrega estimada: {shippingOption.estimated_days} dia(s)
              </p>
            </div>
            <p className="font-medium text-sage-cream">
              {shippingOption.price === 0 ? 'Gratis' : formatCurrency(shippingOption.price)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-sage-cream">
              <CreditCard className="h-5 w-5 text-sage-gold" />
              Metodo de pago
            </h2>
            <button onClick={onEditPayment} className="text-sm text-sage-gold hover:underline">
              Editar
            </button>
          </div>

          <p className="font-medium text-sage-cream">{paymentMethod.name}</p>
          {paymentMethod.description && (
            <p className="text-sm text-sage-ivory/45">{paymentMethod.description}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-sage-cream">Resumen del pedido</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-sage-ivory/55">Subtotal</span>
              <span className="text-sage-cream">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-ivory/55">Envio</span>
              <span className="text-sage-cream">
                {shippingOption.price === 0 ? 'Gratis' : formatCurrency(shippingOption.price)}
              </span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-green-300">
                <span>Descuento</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-sage-surface-hover pt-2 text-lg font-semibold">
              <span className="text-sage-cream">Total</span>
              <span className="text-sage-gold">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold"
        >
          Volver
        </Button>
        <Button onClick={onConfirm} isLoading={isLoading} size="lg" variant="gold">
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
}
