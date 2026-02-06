'use client';

import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth';

/**
 * @ai-context Reset password page - renders ResetPasswordForm component.
 *             Wrapped in Suspense because it uses useSearchParams.
 */

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
