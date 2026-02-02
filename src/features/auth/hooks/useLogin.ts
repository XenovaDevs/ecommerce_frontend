'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types';

/**
 * @ai-context Hook for login form state management.
 *             Wraps useAuth login with form-specific state.
 */

export function useLogin() {
  const { login, error, clearError, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login(credentials);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login: handleLogin,
    isLoading: isLoading || isSubmitting,
    error,
    clearError,
  };
}
