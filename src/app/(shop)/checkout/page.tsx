'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import {
  CheckoutWizard,
  ShippingStep,
  PaymentStep,
  ReviewStep,
  useCheckout,
} from '@/features/checkout';
import { useCart } from '@/features/cart';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, totals, isLoading: cartLoading } = useCart();
  const {
    step,
    setStep,
    nextStep,
    prevStep,
    shippingAddress,
    shippingOptions,
    selectedShippingOption,
    paymentMethods,
    selectedPaymentMethod,
    isLoading,
    error,
    canProceed,
    isStepComplete,
    setShippingAddress,
    setShippingOption,
    setPaymentMethod,
    processCheckout,
  } = useCheckout({ isGuestCheckout: !isAuthenticated });

  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push(ROUTES.CART);
    }
  }, [cartLoading, items.length, router]);

  if (cartLoading || items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-slide-up space-y-6">
          <div className="h-12 w-80 rounded-xl bg-gradient-to-r from-sage-surface-light to-sage-surface animate-shimmer" />
          <div className="h-96 rounded-3xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover animate-shimmer" />
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (step === 'shipping') {
      router.push(ROUTES.CART);
    } else {
      prevStep();
    }
  };

  const handleNext = async () => {
    if (step === 'review') {
      await processCheckout();
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'shipping':
        return (
          <ShippingStep
            initialAddress={shippingAddress}
            shippingOptions={shippingOptions}
            selectedOption={selectedShippingOption}
            onAddressSubmit={setShippingAddress}
            onOptionSelect={setShippingOption}
            onNext={nextStep}
            isLoading={isLoading}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            paymentMethods={paymentMethods}
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={setPaymentMethod}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'review':
        return (
          <ReviewStep
            shippingAddress={shippingAddress!}
            shippingOption={selectedShippingOption!}
            paymentMethod={selectedPaymentMethod!}
            onConfirm={processCheckout}
            onBack={prevStep}
            onEditShipping={() => setStep('shipping')}
            onEditPayment={() => setStep('payment')}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    switch (step) {
      case 'shipping':
        return 'Continuar al pago';
      case 'payment':
        return 'Revisar pedido';
      case 'review':
        return 'Confirmar pedido';
      default:
        return 'Continuar';
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sage-gold/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="font-display text-3xl font-bold text-sage-cream sm:text-5xl">Finalizar compra</h1>
          <p className="mt-3 text-base text-sage-ivory/55 sm:text-lg">
            Completa tu pedido de forma segura y rapida
          </p>
        </div>

        {!authLoading && !isAuthenticated && (
          <Card variant="glass" className="mb-8 border border-sage-gold/20 bg-sage-surface">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-sage-cream">
                    Queres una compra mas rapida?
                  </p>
                  <p className="text-sm text-sage-ivory/55">
                    Podes continuar como invitado o iniciar sesion para usar tus datos guardados.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link href={`${ROUTES.LOGIN}?redirect=${ROUTES.CHECKOUT}`}>
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold sm:w-auto"
                    >
                      Iniciar sesion
                    </Button>
                  </Link>
                  <Link href={`${ROUTES.REGISTER}?redirect=${ROUTES.CHECKOUT}`}>
                    <Button size="md" variant="gold" className="w-full sm:w-auto">
                      Crear cuenta
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckoutWizard
            currentStep={step}
            onStepClick={setStep}
            isStepComplete={isStepComplete}
            isStepAccessible={(checkStep) => {
              const steps: typeof step[] = ['shipping', 'payment', 'review'];
              const checkIndex = steps.indexOf(checkStep);
              const currentIndex = steps.indexOf(step);

              if (checkIndex <= currentIndex) return true;
              if (checkIndex === currentIndex + 1) return isStepComplete(step);

              return false;
            }}
          />
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-950/25 p-6 animate-slide-down">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-10 animate-fade-in">{renderStepContent()}</div>

        {(step === 'payment' || step === 'review') && (
          <Card variant="glass" className="mb-10 border border-sage-surface-light bg-sage-surface animate-scale-in">
            <CardContent className="p-8">
              <h3 className="mb-6 font-display text-2xl font-bold text-sage-cream">Resumen del pedido</h3>
              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span className="font-medium text-sage-ivory/55">Subtotal</span>
                  <span className="font-semibold text-sage-cream">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-300">
                    <span className="font-medium">Descuento</span>
                    <span className="font-semibold">-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                {selectedShippingOption && (
                  <div className="flex justify-between">
                    <span className="font-medium text-sage-ivory/55">Envio</span>
                    <span className="font-semibold text-sage-cream">
                      {selectedShippingOption.price === 0
                        ? 'Gratis'
                        : formatCurrency(selectedShippingOption.price)}
                    </span>
                  </div>
                )}
                <div className="mt-4 border-t border-sage-surface-hover pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-sage-cream">Total</span>
                    <span className="text-2xl font-bold text-sage-gold">
                      {formatCurrency(
                        totals.total + (selectedShippingOption?.price || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col-reverse items-stretch gap-3 animate-fade-in sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Button
            variant="outline"
            size="xl"
            onClick={handleBack}
            disabled={isLoading}
            className="w-full border-sage-surface-hover text-sage-cream hover:border-sage-gold/40 hover:text-sage-gold sm:w-auto"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            {step === 'shipping' ? 'Volver al carrito' : 'Atras'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed || isLoading}
            isLoading={isLoading}
            size="xl"
            variant="gold"
            className="w-full sm:w-auto"
          >
            {getNextButtonText()}
            {step !== 'review' && <ChevronRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
