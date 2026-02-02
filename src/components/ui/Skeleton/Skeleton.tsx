/**
 * @ai-context Skeleton loader component for showing placeholder content during loading.
 *             Supports various shapes, sizes, and pulse animation with sage colors.
 * @ai-props
 *   - variant: Shape of the skeleton (text/circle/rectangle/card)
 *   - width: Width of the skeleton
 *   - height: Height of the skeleton
 *   - count: Number of skeleton elements to render
 *   - className: Additional CSS classes
 * @ai-flow
 *   1. Renders placeholder element with specified shape
 *   2. Applies pulse animation
 *   3. Repeats based on count prop
 * @ai-a11y
 *   - aria-busy and aria-label for screen readers
 *   - Semantic loading indication
 */
'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) => {
  // Convert number to px string
  const getSize = (size?: string | number): string | undefined => {
    if (typeof size === 'number') return `${size}px`;
    return size;
  };

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'circle':
        return {
          className: 'rounded-full',
          defaultWidth: 40,
          defaultHeight: 40,
        };
      case 'rectangle':
        return {
          className: 'rounded-lg',
          defaultWidth: '100%',
          defaultHeight: 100,
        };
      case 'card':
        return {
          className: 'rounded-lg p-6 space-y-4',
          defaultWidth: '100%',
          defaultHeight: 200,
        };
      case 'text':
      default:
        return {
          className: 'rounded',
          defaultWidth: '100%',
          defaultHeight: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const finalWidth = getSize(width) || variantStyles.defaultWidth;
  const finalHeight = getSize(height) || variantStyles.defaultHeight;

  // Render single skeleton
  const renderSkeleton = (index: number) => {
    if (variant === 'card') {
      return (
        <div
          key={index}
          className={cn(
            'bg-sage-100 animate-pulse',
            variantStyles.className,
            className
          )}
          style={{
            width: finalWidth,
            height: finalHeight,
          }}
          role="status"
          aria-label="Loading..."
          aria-busy="true"
        >
          <div className="space-y-4">
            <div className="h-12 bg-sage-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-sage-200 rounded w-3/4"></div>
              <div className="h-4 bg-sage-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-sage-200 rounded flex-1"></div>
              <div className="h-8 bg-sage-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={cn(
          'bg-sage-100 animate-pulse',
          variantStyles.className,
          className
        )}
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
      />
    );
  };

  // Render multiple skeletons
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
      </div>
    );
  }

  return renderSkeleton(0);
};

// Pre-configured skeleton variants for common use cases
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <Skeleton variant="text" count={lines} className={className} />
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <Skeleton variant="card" className={className} />
);

export const SkeletonAvatar = ({ size = 40, className }: { size?: number; className?: string }) => (
  <Skeleton variant="circle" width={size} height={size} className={className} />
);

export const SkeletonButton = ({ className }: { className?: string }) => (
  <Skeleton variant="rectangle" width={100} height={40} className={className} />
);

export const SkeletonImage = ({
  width = '100%',
  height = 200,
  className,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) => <Skeleton variant="rectangle" width={width} height={height} className={className} />;

// Skeleton for table rows
export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);
