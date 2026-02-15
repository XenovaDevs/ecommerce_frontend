'use client';

import { CreditCard, Building2, Banknote, Check } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '../types';

interface PaymentStepProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const PAYMENT_ICONS: Record<string, React.ElementType> = {
  mercadopago: CreditCard,
  bank_transfer: Building2,
  cash: Banknote,
};

export function PaymentStep({
  paymentMethods,
  selectedMethod,
  onMethodSelect,
  onNext,
  onBack,
  isLoading = false,
}: PaymentStepProps) {
  return (
    <div className="space-y-8">
      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-sage-cream">Metodo de pago</h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod?.id === method.id;
              const Icon = PAYMENT_ICONS[method.id] || CreditCard;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onMethodSelect(method)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors',
                    isSelected
                      ? 'border-sage-gold/45 bg-sage-gold/10'
                      : 'border-sage-surface-hover bg-sage-surface-light hover:border-sage-gold/35'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg',
                      isSelected ? 'bg-sage-gold text-sage-black' : 'bg-sage-surface-hover text-sage-ivory/55'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sage-cream">{method.name}</p>
                    {method.description && (
                      <p className="text-sm text-sage-ivory/45">{method.description}</p>
                    )}
                  </div>

                  {isSelected && <Check className="h-5 w-5 text-sage-gold" />}
                </button>
              );
            })}
          </div>

          {selectedMethod?.id === 'mercadopago' && (
            <div className="mt-6 rounded-lg border border-sage-gold/25 bg-sage-gold/10 p-4">
              <p className="text-sm text-sage-ivory/80">
                Seras redirigido a Mercado Pago para completar el pago de forma segura.
                Podras pagar con tarjeta de credito, debito, o dinero en cuenta.
              </p>
            </div>
          )}

          {selectedMethod?.id === 'bank_transfer' && (
            <div className="mt-6 rounded-lg border border-sage-surface-hover bg-sage-surface-light p-4">
              <p className="text-sm text-sage-ivory/70">
                Te enviaremos los datos bancarios por email despues de confirmar el pedido.
                Tu pedido quedara reservado por 48 horas.
              </p>
            </div>
          )}
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
        <Button onClick={onNext} disabled={!selectedMethod} isLoading={isLoading} size="lg" variant="gold">
          Revisar pedido
        </Button>
      </div>
    </div>
  );
}
