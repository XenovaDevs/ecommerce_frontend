'use client';

import { CreditCard, Building2, Banknote, Check } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { PaymentMethod } from '../types';

/**
 * @ai-context Payment method selection step.
 */

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
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Método de pago
          </h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod?.id === method.id;
              const Icon = PAYMENT_ICONS[method.type] || CreditCard;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onMethodSelect(method)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-lg',
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    {method.description && (
                      <p className="text-sm text-gray-500">{method.description}</p>
                    )}
                  </div>

                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </button>
              );
            })}
          </div>

          {selectedMethod?.type === 'mercadopago' && (
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Serás redirigido a Mercado Pago para completar el pago de forma segura.
                Podrás pagar con tarjeta de crédito, débito, o dinero en cuenta.
              </p>
            </div>
          )}

          {selectedMethod?.type === 'bank_transfer' && (
            <div className="mt-6 rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Te enviaremos los datos bancarios por email después de confirmar el pedido.
                Tu pedido quedará reservado por 48 horas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedMethod}
          isLoading={isLoading}
          size="lg"
        >
          Revisar pedido
        </Button>
      </div>
    </div>
  );
}
