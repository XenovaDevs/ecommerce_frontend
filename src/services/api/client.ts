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
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data.data;

          Cookies.set(STORAGE_KEYS.AUTH_TOKEN, access_token, { expires: 1 });
          Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token, { expires: 7 });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
        Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };

/**
 * @ai-context Helper function to set auth tokens
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  Cookies.set(STORAGE_KEYS.AUTH_TOKEN, accessToken, { expires: 1 }); // 1 day
  Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, { expires: 7 }); // 7 days
}

/**
 * @ai-context Helper function to clear auth tokens
 */
export function clearAuthTokens(): void {
  Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
  Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * @ai-context Check if user is authenticated (has token)
 */
export function hasAuthToken(): boolean {
  return !!Cookies.get(STORAGE_KEYS.AUTH_TOKEN);
}
