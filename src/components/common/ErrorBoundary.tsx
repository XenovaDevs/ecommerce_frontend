'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { ErrorMessages } from '@/messages';

/**
 * @ai-context Error boundary component to catch and display errors gracefully.
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you could send to error monitoring service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {ErrorMessages.GENERAL.UNKNOWN}
          </h2>
          <p className="mt-2 text-gray-500">
            {ErrorMessages.GENERAL.TRY_AGAIN}
          </p>
          <Button
            onClick={this.handleRetry}
            variant="outline"
            className="mt-6"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Reintentar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
