import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';
import { ApiError } from '@/types';

/**
 * @ai-context Axios HTTP client wrapper with authentication interceptors.
 *             Handles token management, request/response interceptors,
 *             and automatic token refresh.
 * @ai-flow
 *   1. Creates axios instance with base config
 *   2. Request interceptor adds auth token
 *   3. Response interceptor handles errors and token refresh
 */

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token ?? undefined);
    }
  });
  failedQueue = [];
};

function createSessionId(): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getOrCreateCartSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  const existing = Cookies.get(STORAGE_KEYS.CART_ID);
  if (existing) return existing;

  const isSecure = window.location.protocol === 'https:';
  const sessionId = createSessionId();
  Cookies.set(STORAGE_KEYS.CART_ID, sessionId, {
    expires: 7,
    sameSite: 'lax',
    secure: isSecure,
  });

  return sessionId;
}

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const sessionId = getOrCreateCartSessionId();
    if (sessionId && config.headers) {
      config.headers['X-Session-ID'] = sessionId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url || '';
    const hasStoredToken = hasAuthToken();
    const hasAuthorizationHeader = Boolean(originalRequest?.headers?.Authorization);
    const shouldAttemptRefresh = hasStoredToken || hasAuthorizationHeader;

    // Handle 401 - Token expired
    if (
      error.response?.status === 401
      && shouldAttemptRefresh
      && !originalRequest._retry
      && !requestUrl.includes('/auth/refresh')
      && !requestUrl.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        const payload = response.data?.data || response.data;
        const accessToken = payload?.access_token;

        if (!accessToken) {
          throw new Error('Refresh did not return access_token');
        }

        setAuthTokens(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        processQueue(refreshError, null);
        Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };

/**
 * @ai-context Helper function to set auth tokens
 */
export function setAuthTokens(accessToken: string): void {
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  Cookies.set(STORAGE_KEYS.AUTH_TOKEN, accessToken, {
    expires: 1 / 96, // 15 minutes
    sameSite: 'strict',
    secure: isSecure,
  });
}

/**
 * @ai-context Helper function to clear auth tokens
 */
export function clearAuthTokens(): void {
  Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * @ai-context Check if user is authenticated (has token)
 */
export function hasAuthToken(): boolean {
  return !!Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
}
