'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types';

/**
 * @ai-context Hook for registration form state management.
 *             Wraps useAuth register with form-specific state.
 */

export function useRegister() {
  const { register, error, clearError, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data: RegisterData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await register(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register: handleRegister,
    isLoading: isLoading || isSubmitting,
    error,
    clearError,
  };
}
