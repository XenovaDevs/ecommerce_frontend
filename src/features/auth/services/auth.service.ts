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

interface AuthPayload {
  user: User;
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

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
    const response = await apiClient.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const data = response.data.data;
    const user = data.user;
    const tokens = {
      access_token: data.access_token,
      token_type: data.token_type || 'Bearer',
      expires_in: data.expires_in || 3600,
    };
    setAuthTokens(tokens.access_token);

    return { user, tokens };
  },

  /**
   * @ai-context Registers a new user account
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthPayload>>(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData
    );

    const data = response.data.data;
    const user = data.user;
    const tokens = {
      access_token: data.access_token,
      token_type: data.token_type || 'Bearer',
      expires_in: data.expires_in || 3600,
    };
    setAuthTokens(tokens.access_token);

    return { user, tokens };
  },

  async refreshAccessToken(): Promise<void> {
    const response = await apiClient.post<ApiResponse<AuthPayload>>(API_ENDPOINTS.AUTH.REFRESH, {});
    const data = response.data.data || response.data;
    setAuthTokens(data.access_token);
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
