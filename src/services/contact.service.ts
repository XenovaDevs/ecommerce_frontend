import { apiClient } from './api';
import type { ApiResponse, ContactMessage, CreateContactMessageData } from '@/types';

/**
 * @ai-context Contact service for managing customer support messages.
 *             Public endpoint for submitting inquiries.
 */

const ENDPOINTS = {
  PUBLIC: {
    SUBMIT: '/v1/contact',
  },
} as const;

/**
 * Public contact service methods.
 */
export const contactService = {
  /**
   * Submit a contact message (public endpoint).
   */
  async submit(data: CreateContactMessageData): Promise<ApiResponse<ContactMessage>> {
    const response = await apiClient.post(ENDPOINTS.PUBLIC.SUBMIT, data);
    return response.data;
  },
};
