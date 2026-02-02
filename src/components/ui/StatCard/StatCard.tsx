/**
 * @ai-context StatCard component for displaying key metrics and statistics.
 *             Features icon, large number, label, trend indicator, and loading state.
 * @ai-props
 *   - icon: Icon component to display
 *   - label: Descriptive label for the statistic
 *   - value: The main statistic value (string or number)
 *   - description: Optional secondary description
 *   - trend: Trend data with value and direction
 *   - variant: Color theme (sage/gold/success/danger)
 *   - loading: Show skeleton loading state
 *   - onClick: Optional click handler
 * @ai-flow
 *   1. Displays icon with colored background
 *   2. Shows large statistic value
 *   3. Renders label and optional description
 *   4. Shows trend indicator with up/down arrow
 *   5. Supports loading skeleton state
 * @ai-a11y
 *   - Semantic HTML structure
 *   - Accessible click handler if provided
 *   - Clear visual hierarchy
 */
'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'sage' | 'gold' | 'success' | 'danger';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  sage: {
    background: 'bg-sage-50',
    icon: 'text-sage-600',
    border: 'border-sage-200',
  },
  gold: {
    background: 'bg-gold-50',
    icon: 'text-gold-600',
    border: 'border-gold-200',
  },
  success: {
    background: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  danger: {
    background: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-200',
  },
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  trend,
  variant = 'sage',
  loading = false,
  onClick,
  className,
}: StatCardProps) => {
  const styles = variantStyles[variant];
  const isClickable = !!onClick;

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={cn(
          'bg-white border border-sage-200 rounded-lg p-6',
          'animate-pulse',
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-sage-100 rounded-lg"></div>
          <div className="w-16 h-6 bg-sage-100 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-24 h-8 bg-sage-100 rounded"></div>
          <div className="w-32 h-4 bg-sage-100 rounded"></div>
        </div>
      </div>
    );
  }

  const CardWrapper = isClickable ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={cn(
        'bg-white border border-sage-200 rounded-lg p-6',
        'transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-lg hover:border-sage-300',
        'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
        'text-left w-full',
        className
      )}
    >
      {/* Header with icon and trend */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        {Icon && (
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', styles.background)}>
            <Icon className={cn('w-6 h-6', styles.icon)} />
          </div>
        )}

        {/* Trend indicator */}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
              trend.isPositive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Value */}
        <div className="text-3xl font-bold text-sage-900">{value}</div>

        {/* Label */}
        <div className="text-sm font-medium text-sage-600">{label}</div>

        {/* Description */}
        {description && (
          <div className="text-xs text-sage-500 mt-1">{description}</div>
        )}
      </div>
    </CardWrapper>
  );
};
