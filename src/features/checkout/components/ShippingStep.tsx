'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, Clock, Check } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { ValidationMessages } from '@/messages';
import type { ShippingAddressForm, ShippingOption } from '../types';

/**
 * @ai-context Shipping step with address form and shipping option selection.
 */

const shippingSchema = z.object({
  first_name: z.string().min(2, ValidationMessages.min(2)),
  last_name: z.string().min(2, ValidationMessages.min(2)),
  street: z.string().min(3, ValidationMessages.min(3)),
  number: z.string().min(1, ValidationMessages.required),
  apartment: z.string().optional(),
  city: z.string().min(2, ValidationMessages.min(2)),
  state: z.string().min(2, ValidationMessages.min(2)),
  postal_code: z.string().min(4, ValidationMessages.postalCode),
  country: z.string().min(1),
  phone: z.string().min(8, ValidationMessages.phone),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingStepProps {
  initialAddress?: ShippingAddressForm | null;
  shippingOptions: ShippingOption[];
  selectedOption: ShippingOption | null;
  onAddressSubmit: (address: ShippingAddressForm) => Promise<void>;
  onOptionSelect: (option: ShippingOption) => void;
  onNext: () => void;
  isLoading?: boolean;
}

export function ShippingStep({
  initialAddress,
  shippingOptions,
  selectedOption,
  onAddressSubmit,
  onOptionSelect,
  onNext,
  isLoading = false,
}: ShippingStepProps) {
  const [addressSubmitted, setAddressSubmitted] = useState(!!initialAddress);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: initialAddress || {
      country: 'Argentina',
    },
  });

  const onSubmit = async (data: ShippingFormData) => {
    await onAddressSubmit(data as ShippingAddressForm);
    setAddressSubmitted(true);
  };

  const canProceed = addressSubmitted && selectedOption;

  return (
    <div className="space-y-8">
      {/* Address Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Dirección de envío
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                {...register('first_name')}
                error={errors.first_name?.message}
                placeholder="Juan"
              />
              <Input
                label="Apellido"
                {...register('last_name')}
                error={errors.last_name?.message}
                placeholder="Pérez"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  label="Calle"
                  {...register('street')}
                  error={errors.street?.message}
                  placeholder="Av. Corrientes"
                />
              </div>
              <Input
                label="Número"
                {...register('number')}
                error={errors.number?.message}
                placeholder="1234"
              />
            </div>

            <Input
              label="Departamento (opcional)"
              {...register('apartment')}
              error={errors.apartment?.message}
              placeholder="Piso 3, Depto B"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Ciudad"
                {...register('city')}
                error={errors.city?.message}
                placeholder="Buenos Aires"
              />
              <Input
                label="Provincia"
                {...register('state')}
                error={errors.state?.message}
                placeholder="CABA"
              />
              <Input
                label="Código Postal"
                {...register('postal_code')}
                error={errors.postal_code?.message}
                placeholder="1000"
              />
            </div>

            <Input
              label="Teléfono"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+54 11 1234-5678"
            />

            <Button
              type="submit"
              isLoading={isSubmitting || isLoading}
              className="w-full sm:w-auto"
            >
              {addressSubmitted ? 'Actualizar dirección' : 'Calcular envío'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      {addressSubmitted && shippingOptions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              Opciones de envío
            </h2>

            <div className="space-y-3">
              {shippingOptions.map((option) => {
                const isSelected = selectedOption?.id === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onOptionSelect(option)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full',
                          isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {option.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {option.provider}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {option.price === 0 ? 'Gratis' : formatCurrency(option.price)}
                      </p>
                      <p className="flex items-center justify-end gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {option.estimated_days === 1
                          ? '1 día'
                          : `${option.estimated_days} días`}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="ml-2 h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
        >
          Continuar al pago
        </Button>
      </div>
    </div>
  );
}
