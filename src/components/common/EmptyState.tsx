import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * @ai-context Empty state component for lists with no data.
 */

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center animate-scale-in',
        className
      )}
    >
      {icon && (
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-sage-surface-light to-sage-surface-hover p-6 text-sage-ivory/40 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-bold text-sage-cream">{title}</h3>
      {description && (
        <p className="mt-3 max-w-md text-base leading-relaxed text-sage-ivory/55">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
