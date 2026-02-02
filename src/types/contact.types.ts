/**
 * @ai-context Contact message types for customer support system.
 *             Defines structure for contact messages and related operations.
 */

export enum ContactMessageStatus {
  PENDING = 'pending',
  REPLIED = 'replied',
  CLOSED = 'closed',
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  status_label: string;
  admin_reply?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageFilters {
  status?: ContactMessageStatus;
  email?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface UpdateContactMessageStatusData {
  status: ContactMessageStatus;
}

export interface ReplyContactMessageData {
  admin_reply: string;
}
