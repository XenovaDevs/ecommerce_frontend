'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkoutService } from '../services';
import { useCart } from '@/features/cart';
import { ROUTES } from '@/constants';
import type {
  CheckoutStep,
  ShippingAddress,
  ShippingOption,
  PaymentMethod,
  Order,
} from '../types';

/**
 * @ai-context Hook for managing checkout flow state and actions.
 */

interface UseCheckoutReturn {
  // State
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingAddress: (address: ShippingAddress) => Promise<void>;
  setShippingOption: (option: ShippingOption) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  processCheckout: () => Promise<Order | null>;
  reset: () => void;

  // Helpers
  canProceed: boolean;
  isStepComplete: (step: CheckoutStep) => boolean;
}

const STEP_ORDER: CheckoutStep[] = ['shipping', 'payment', 'review'];

export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const { clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddressState] = useState<ShippingAddress | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set shipping address and fetch shipping options
  const setShippingAddress = useCallback(async (address: ShippingAddress) => {
    setIsLoading(true);
    setError(null);

    try {
      setShippingAddressState(address);

      // Fetch shipping options for this address
      const options = await checkoutService.getShippingQuote(address);
      setShippingOptions(options);

      // Auto-select first option
      if (options.length > 0) {
        setSelectedShippingOption(options[0]);
      }

      // Also fetch payment methods
      const methods = await checkoutService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err) {
      setError('Error al obtener opciones de envío');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set shipping option
  const setShippingOption = useCallback((option: ShippingOption) => {
    setSelectedShippingOption(option);
  }, []);

  // Set payment method
  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  }, []);

  // Navigate to next step
  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [step]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [step]);

  // Check if a step is complete
  const isStepComplete = useCallback(
    (checkStep: CheckoutStep): boolean => {
      switch (checkStep) {
        case 'shipping':
          return !!shippingAddress && !!selectedShippingOption;
        case 'payment':
          return !!selectedPaymentMethod;
        case 'review':
          return false; // Review is never "complete" until order is placed
        default:
          return false;
      }
    },
    [shippingAddress, selectedShippingOption, selectedPaymentMethod]
  );

  // Can proceed to next step
  const canProceed = isStepComplete(step);

  // Process checkout
  const processCheckout = useCallback(async (): Promise<Order | null> => {
    if (!shippingAddress || !selectedShippingOption || !selectedPaymentMethod) {
      setError('Por favor completa todos los pasos');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate cart first
      const validation = await checkoutService.validateCart();
      if (!validation.valid) {
        setError(validation.errors?.join(', ') || 'Error en el carrito');
        return null;
      }

      // Process checkout
      const order = await checkoutService.processCheckout({
        shipping_address: shippingAddress,
        shipping_option_id: selectedShippingOption.id,
        payment_method_id: selectedPaymentMethod.id,
      });

      // If Mercado Pago, redirect to payment
      if (selectedPaymentMethod.type === 'mercadopago') {
        const preference = await checkoutService.createPaymentPreference(order.id);
        // Use sandbox in development
        const paymentUrl =
          process.env.NODE_ENV === 'production'
            ? preference.init_point
            : preference.sandbox_init_point;
        window.location.href = paymentUrl;
        return order;
      }

      // Clear cart and redirect to success
      clearCart();
      router.push(`${ROUTES.CHECKOUT_SUCCESS}?order=${order.order_number}`);
      return order;
    } catch (err) {
      setError('Error al procesar el pedido');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [shippingAddress, selectedShippingOption, selectedPaymentMethod, clearCart, router]);

  // Reset checkout state
  const reset = useCallback(() => {
    setStep('shipping');
    setShippingAddressState(null);
    setShippingOptions([]);
    setSelectedShippingOption(null);
    setPaymentMethods([]);
    setSelectedPaymentMethod(null);
    setError(null);
  }, []);

  return {
    step,
    shippingAddress,
    shippingOptions,
    selectedShippingOption,
    paymentMethods,
    selectedPaymentMethod,
    isLoading,
    error,
    setStep,
    nextStep,
    prevStep,
    setShippingAddress,
    setShippingOption,
    setPaymentMethod,
    processCheckout,
    reset,
    canProceed,
    isStepComplete,
  };
}

/**
 * @ai-context Hook for fetching user orders
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await checkoutService.getOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading orders'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error, fetchOrders };
}
