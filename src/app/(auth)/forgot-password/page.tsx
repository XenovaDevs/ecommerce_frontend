import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  description: 'Solicita un enlace para restablecer tu contraseña',
};

/**
 * @ai-context Forgot password page - renders ForgotPasswordForm component.
 */

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
