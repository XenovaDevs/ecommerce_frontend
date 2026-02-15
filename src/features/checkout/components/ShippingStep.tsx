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

const shippingSchema = z.object({
  first_name: z.string().min(2, ValidationMessages.min(2)),
  last_name: z.string().min(2, ValidationMessages.min(2)),
  email: z.email('Ingresa un email valido'),
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

const fieldClassName =
  'border-sage-surface-hover bg-sage-surface-light text-sage-cream placeholder:text-sage-ivory/35 hover:border-sage-gold/40 focus:border-sage-gold/40 focus:ring-sage-gold/10';
const fieldContainerClassName =
  '[&_label]:text-sage-ivory/70 [&_.text-red-600]:text-red-300';

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
      email: '',
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
      <Card className="border border-sage-surface-light bg-sage-surface">
        <CardContent className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-sage-cream">Direccion de envio</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                {...register('first_name')}
                error={errors.first_name?.message}
                placeholder="Juan"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
              <Input
                label="Apellido"
                {...register('last_name')}
                error={errors.last_name?.message}
                placeholder="Perez"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
            </div>

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="tu@email.com"
              className={fieldClassName}
              containerClassName={fieldContainerClassName}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  label="Calle"
                  {...register('street')}
                  error={errors.street?.message}
                  placeholder="Av. Corrientes"
                  className={fieldClassName}
                  containerClassName={fieldContainerClassName}
                />
              </div>
              <Input
                label="Numero"
                {...register('number')}
                error={errors.number?.message}
                placeholder="1234"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
            </div>

            <Input
              label="Departamento (opcional)"
              {...register('apartment')}
              error={errors.apartment?.message}
              placeholder="Piso 3, Depto B"
              className={fieldClassName}
              containerClassName={fieldContainerClassName}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Ciudad"
                {...register('city')}
                error={errors.city?.message}
                placeholder="Buenos Aires"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
              <Input
                label="Provincia"
                {...register('state')}
                error={errors.state?.message}
                placeholder="CABA"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
              <Input
                label="Codigo Postal"
                {...register('postal_code')}
                error={errors.postal_code?.message}
                placeholder="1000"
                className={fieldClassName}
                containerClassName={fieldContainerClassName}
              />
            </div>

            <Input
              label="Telefono"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+54 11 1234-5678"
              className={fieldClassName}
              containerClassName={fieldContainerClassName}
            />

            <Button
              type="submit"
              isLoading={isSubmitting || isLoading}
              className="w-full sm:w-auto"
              variant="gold"
            >
              {addressSubmitted ? 'Actualizar direccion' : 'Calcular envio'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {addressSubmitted && shippingOptions.length > 0 && (
        <Card className="border border-sage-surface-light bg-sage-surface">
          <CardContent className="p-6">
            <h2 className="mb-6 text-lg font-semibold text-sage-cream">Opciones de envio</h2>

            <div className="space-y-3">
              {shippingOptions.map((option) => {
                const isSelected = selectedOption?.id === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onOptionSelect(option)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors',
                      isSelected
                        ? 'border-sage-gold/45 bg-sage-gold/10'
                        : 'border-sage-surface-hover bg-sage-surface-light hover:border-sage-gold/35'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full',
                          isSelected ? 'bg-sage-gold text-sage-black' : 'bg-sage-surface-hover text-sage-ivory/55'
                        )}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sage-cream">{option.name}</p>
                        <p className="text-sm text-sage-ivory/45">{option.provider}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-sage-cream">
                        {option.price === 0 ? 'Gratis' : formatCurrency(option.price)}
                      </p>
                      <p className="flex items-center justify-end gap-1 text-sm text-sage-ivory/45">
                        <Clock className="h-3 w-3" />
                        {option.estimated_days === 1
                          ? '1 dia'
                          : `${option.estimated_days} dias`}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="ml-2 h-5 w-5 text-sage-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed} size="lg" variant="gold">
          Continuar al pago
        </Button>
      </div>
    </div>
  );
}
