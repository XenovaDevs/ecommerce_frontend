'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @ai-context Sophisticated Button component for Le Pas Sage ecommerce.
 *             Implements black/white/gold design system with luxury aesthetic.
 * @ai-props
 *   - variant: Visual style (sage, gold, outline, ghost, danger, link)
 *   - size: Button size (sm, md, lg, xl, icon)
 *   - isLoading: Shows loading spinner and disables button
 *   - leftIcon/rightIcon: Icons to display
 *   - fullWidth: Makes button take full container width
 * @ai-flow
 *   1. Renders button with proper variant styles
 *   2. Shows loading spinner when isLoading is true
 *   3. Applies sophisticated hover/focus effects
 * @ai-a11y
 *   - Uses native button element
 *   - Disabled state properly conveyed
 *   - Focus visible with high contrast ring
 *   - Loading state communicated visually
 * @ai-security
 *   - Prevents double-clicks during loading state
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        // Sage Black - Primary brand button
        sage:
          'bg-sage-black text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-sage-black/90 focus-visible:ring-sage-black relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',

        // Gold - Luxury accent button
        gold:
          'bg-sage-gold text-sage-white shadow-gold hover:shadow-gold-lg hover:bg-sage-gold-dark focus-visible:ring-sage-gold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',

        // Secondary - Gray button
        secondary:
          'bg-sage-gray-700 text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-sage-gray-600 focus-visible:ring-sage-gray-700',

        // Outline - Sophisticated border
        outline:
          'border-2 border-sage-gray-300 bg-background text-sage-black hover:bg-sage-gray-50 hover:border-sage-black focus-visible:ring-sage-black transition-sophisticated',

        // Ghost - Minimal interaction
        ghost:
          'text-sage-black hover:bg-sage-gray-100 focus-visible:ring-sage-black transition-sophisticated',

        // Danger - Understated destructive
        danger:
          'bg-destructive text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-destructive/90 focus-visible:ring-destructive',

        // Link - Text button
        link:
          'text-sage-black underline-offset-4 hover:underline focus-visible:ring-sage-black',

        // Gradient - Sophisticated gradient
        'gradient-sage':
          'gradient-sage text-sage-white shadow-elegant-lg hover:shadow-gold focus-visible:ring-sage-gold transition-sophisticated',

        'gradient-gold':
          'gradient-gold text-sage-white shadow-gold hover:shadow-gold-lg focus-visible:ring-sage-gold transition-sophisticated',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'sage',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
