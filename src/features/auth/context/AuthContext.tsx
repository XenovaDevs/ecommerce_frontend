'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { ROUTES } from '@/constants';
import { ErrorMessages } from '@/messages';
import type { ApiError } from '@/types';
import { hasAuthToken } from '@/services/api';
import { authService } from '../services';
import type {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterData,
  User,
} from '../types';

/**
 * @ai-context Authentication context provider.
 *             Manages user authentication state and provides auth methods.
 * @ai-flow
 *   1. On mount: checks for existing token, fetches user if found
 *   2. Login/Register: calls API, stores tokens, updates state
 *   3. Logout: clears tokens, redirects to login
 * @ai-security
 *   - Tokens stored in httpOnly-safe cookies via js-cookie
 *   - Auto-logout on 401 handled by API interceptor
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

const getSafeRedirectFromLocation = (): string => {
  if (typeof window === 'undefined') {
    return ROUTES.HOME;
  }

  const redirect = new URLSearchParams(window.location.search).get('redirect');

  if (!redirect || !redirect.startsWith('/')) {
    return ROUTES.HOME;
  }

  return redirect;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  const setUser = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }));
  };

  const setError = (error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const handleAuthError = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError | undefined;
      if (apiError?.error?.details) {
        const messages = Object.values(apiError.error.details).flat();
        return messages.join('. ');
      }
      return apiError?.error?.message || ErrorMessages.AUTH.INVALID_CREDENTIALS;
    }
    return ErrorMessages.GENERAL.UNKNOWN;
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!hasAuthToken()) {
        setUser(null);
        return;
      }

      try {
        await authService.refreshAccessToken();
        const user = await authService.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
      router.push(getSafeRedirectFromLocation());
    } catch (error) {
      const message = handleAuthError(error);
      setError(message);
      throw error;
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    try {
      const { user } = await authService.register(data);
      setUser(user);
      router.push(getSafeRedirectFromLocation());
    } catch (error) {
      const message = handleAuthError(error);
      setError(message);
      throw error;
    }
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      await authService.refreshAccessToken();
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
