import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * @ai-context Sophisticated Badge component for Le Pas Sage ecommerce.
 *             Implements refined status indicators and labels.
 * @ai-props
 *   - variant: Visual style (default, sage, gold, success, warning, danger, etc.)
 *   - size: Badge size (sm, md, lg)
 *   - pulse: Enables subtle pulse animation
 * @ai-a11y
 *   - Sufficient color contrast for all variants
 *   - Text remains readable on all backgrounds
 */

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight transition-sophisticated',
  {
    variants: {
      variant: {
        // Default - Neutral gray
        default:
          'bg-sage-gray-100 text-sage-gray-800 hover:bg-sage-gray-200',

        // Sage - Black brand badge
        sage:
          'bg-sage-black/10 text-sage-black hover:bg-sage-black/20',

        // Gold - Luxury accent badge
        gold:
          'bg-sage-gold/15 text-sage-gold-dark hover:bg-sage-gold/25',

        // Success - Subtle green
        success:
          'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200',

        // Warning - Subtle yellow
        warning:
          'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200',

        // Danger - Subtle red
        danger:
          'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200',

        // Info - Subtle blue
        info:
          'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200',

        // Outline - Sophisticated border
        outline:
          'border-2 border-sage-gray-300 bg-transparent text-sage-gray-700 hover:bg-sage-gray-50',

        // Outline Sage - Black outline
        'outline-sage':
          'border-2 border-sage-black bg-transparent text-sage-black hover:bg-sage-black/5',

        // Outline Gold - Gold outline
        'outline-gold':
          'border-2 border-sage-gold bg-transparent text-sage-gold-dark hover:bg-sage-gold/10',

        // Gradient - Sophisticated gradient
        'gradient-sage':
          'gradient-sage text-sage-white shadow-elegant',

        'gradient-gold':
          'gradient-gold text-sage-white shadow-elegant',

        // Glow - Emphasized badge
        glow:
          'bg-sage-black text-sage-white shadow-elegant-lg',

        'glow-gold':
          'bg-sage-gold text-sage-white shadow-gold animate-glow-gold',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      pulse: {
        true: 'animate-pulse-subtle',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      pulse: false,
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, pulse, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, pulse }), className)} {...props} />
  );
}
