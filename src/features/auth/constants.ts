import { z } from 'zod';
import { ValidationMessages } from '@/messages';

/**
 * @ai-context Auth feature constants and validation schemas.
 */

export const AUTH_VALIDATION = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MAX_LENGTH: 20,
} as const;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ValidationMessages.required)
    .email(ValidationMessages.email)
    .max(AUTH_VALIDATION.EMAIL_MAX_LENGTH),
  password: z
    .string()
    .min(1, ValidationMessages.required)
    .min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH, ValidationMessages.min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH)),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, ValidationMessages.required)
      .min(AUTH_VALIDATION.NAME_MIN_LENGTH, ValidationMessages.min(AUTH_VALIDATION.NAME_MIN_LENGTH))
      .max(AUTH_VALIDATION.NAME_MAX_LENGTH, ValidationMessages.max(AUTH_VALIDATION.NAME_MAX_LENGTH)),
    last_name: z
      .string()
      .min(1, ValidationMessages.required)
      .min(AUTH_VALIDATION.NAME_MIN_LENGTH, ValidationMessages.min(AUTH_VALIDATION.NAME_MIN_LENGTH))
      .max(AUTH_VALIDATION.NAME_MAX_LENGTH, ValidationMessages.max(AUTH_VALIDATION.NAME_MAX_LENGTH)),
    email: z
      .string()
      .min(1, ValidationMessages.required)
      .email(ValidationMessages.email)
      .max(AUTH_VALIDATION.EMAIL_MAX_LENGTH),
    password: z
      .string()
      .min(1, ValidationMessages.required)
      .min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH, ValidationMessages.min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH))
      .max(AUTH_VALIDATION.PASSWORD_MAX_LENGTH),
    password_confirmation: z.string().min(1, ValidationMessages.required),
    phone: z
      .string()
      .max(AUTH_VALIDATION.PHONE_MAX_LENGTH)
      .optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: ValidationMessages.passwordMatch,
    path: ['password_confirmation'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
