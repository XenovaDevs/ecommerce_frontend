/**
 * @ai-context Toast notification component for displaying success/error/warning/info messages.
 *             Auto-dismisses with timer, supports multiple toasts stacking.
 * @ai-props
 *   - id: Unique identifier for the toast
 *   - type: Visual variant (success/error/warning/info)
 *   - message: Text to display
 *   - duration: Auto-dismiss time in milliseconds
 *   - onClose: Callback when toast is closed
 * @ai-flow
 *   1. Toast appears with slide-in animation
 *   2. Shows icon based on type
 *   3. Auto-dismisses after duration
 *   4. User can manually close
 *   5. Slides out on close
 * @ai-a11y
 *   - role="alert" for screen readers
 *   - Focusable close button
 *   - Color not sole indicator (uses icons)
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconClassName: 'text-green-600',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconClassName: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClassName: 'text-amber-600',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClassName: 'text-blue-600',
  },
};

export const Toast = ({ id, type, message, duration = 5000, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'w-[calc(100vw-2rem)] max-w-md sm:w-auto sm:min-w-[320px]',
        'transition-all duration-300',
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100',
        config.className
      )}
    >
      {/* Icon */}
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)} />

      {/* Message */}
      <p className="flex-1 text-sm font-medium">{message}</p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn(
          'flex-shrink-0 p-1 rounded transition-colors',
          'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-1',
          config.iconClassName.replace('text-', 'focus:ring-')
        )}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
