'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

/**
 * @ai-context Checkout page with multi-step wizard for shipping, payment, and review.
 *             Integrates all checkout components and manages the checkout flow.
 */

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
  } = useCheckout();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !cartLoading) {
      router.push(`${ROUTES.LOGIN}?redirect=${ROUTES.CHECKOUT}`);
    }
  }, [isAuthenticated, cartLoading, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push(ROUTES.CART);
    }
  }, [cartLoading, items.length, router]);

  if (cartLoading || !isAuthenticated || items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-slide-up space-y-6">
          <div className="h-12 w-80 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-shimmer" />
          <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl animate-shimmer" />
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Finalizar compra</h1>
        <p className="mt-3 text-lg text-gray-600">
          Completa tu pedido de forma segura y rápida
        </p>
      </div>

      {/* Wizard */}
      <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CheckoutWizard
          currentStep={step}
          onStepClick={setStep}
          isStepComplete={isStepComplete}
          isStepAccessible={(checkStep) => {
            const steps: typeof step[] = ['shipping', 'payment', 'review'];
            const checkIndex = steps.indexOf(checkStep);
            const currentIndex = steps.indexOf(step);

            // Can access previous steps or current step
            if (checkIndex <= currentIndex) return true;

            // Can access next step if current is complete
            if (checkIndex === currentIndex + 1) return isStepComplete(step);

            return false;
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 rounded-xl bg-red-50 border border-red-100 p-6 animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-10 animate-fade-in">{renderStepContent()}</div>

      {/* Order Summary Sidebar (visible on payment and review) */}
      {(step === 'payment' || step === 'review') && (
        <Card variant="glass" className="mb-10 border-2 border-white/20 shadow-2xl backdrop-blur-xl animate-scale-in">
          <CardContent className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Resumen del pedido</h3>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Descuento</span>
                  <span className="font-semibold">-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              {selectedShippingOption && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Envío</span>
                  <span className="font-semibold text-gray-900">
                    {selectedShippingOption.price === 0
                      ? 'Gratis'
                      : formatCurrency(selectedShippingOption.price)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-100 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">
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

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 animate-fade-in">
        <Button
          variant="outline"
          size="xl"
          onClick={handleBack}
          disabled={isLoading}
          className="shadow-sm"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          {step === 'shipping' ? 'Volver al carrito' : 'Atrás'}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          isLoading={isLoading}
          size="xl"
          variant="gradient-sage"
          className="shadow-xl shadow-primary/20"
        >
          {getNextButtonText()}
          {step !== 'review' && <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
