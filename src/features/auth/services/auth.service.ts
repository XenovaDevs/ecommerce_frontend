import { apiClient, setAuthTokens, clearAuthTokens } from '@/services/api';
import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types';

/**
 * @ai-context Authentication service for API calls.
 *             Handles login, register, logout, token refresh, and user fetching.
 * @ai-flow
 *   1. Makes API request
 *   2. On success: stores tokens, returns data
 *   3. On failure: throws error with message
 */

export const authService = {
  /**
   * @ai-context Authenticates user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const { user, tokens } = response.data.data;
    setAuthTokens(tokens.access_token, tokens.refresh_token);

    return { user, tokens };
  },

  /**
   * @ai-context Registers a new user account
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    const { user, tokens } = response.data.data;
    setAuthTokens(tokens.access_token, tokens.refresh_token);

    return { user, tokens };
  },

  /**
   * @ai-context Logs out the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * @ai-context Gets the currently authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  },

  /**
   * @ai-context Sends password reset email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * @ai-context Resets user password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
