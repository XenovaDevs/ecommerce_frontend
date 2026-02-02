'use client';

import { Check, Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckoutStep } from '../types';

/**
 * @ai-context Checkout wizard with step indicator and navigation.
 * @ai-props
 *   - currentStep: Current checkout step
 *   - onStepClick: Callback when user clicks a step
 *   - isStepComplete: Function to check if step is complete
 */

interface CheckoutWizardProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
  isStepComplete: (step: CheckoutStep) => boolean;
  isStepAccessible?: (step: CheckoutStep) => boolean;
}

interface StepConfig {
  id: CheckoutStep;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  { id: 'shipping', label: 'Envío', icon: Truck },
  { id: 'payment', label: 'Pago', icon: CreditCard },
  { id: 'review', label: 'Confirmar', icon: ClipboardCheck },
];

export function CheckoutWizard({
  currentStep,
  onStepClick,
  isStepComplete,
  isStepAccessible,
}: CheckoutWizardProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Pasos del checkout" className="mb-8">
      <ol className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = isStepComplete(step.id);
          const isPast = index < currentIndex;
          const isAccessible = isStepAccessible?.(step.id) ?? (isPast || isActive);
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex items-center">
              {/* Step Circle */}
              <button
                onClick={() => isAccessible && onStepClick?.(step.id)}
                disabled={!isAccessible}
                className={cn(
                  'flex flex-col items-center transition-colors',
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isActive && 'border-primary bg-primary text-white',
                    isComplete && !isActive && 'border-green-500 bg-green-500 text-white',
                    !isActive && !isComplete && 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isActive && 'text-primary',
                    isComplete && !isActive && 'text-green-600',
                    !isActive && !isComplete && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-12 sm:w-24',
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
