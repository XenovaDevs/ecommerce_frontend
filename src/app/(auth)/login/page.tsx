import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en tu cuenta',
};

/**
 * @ai-context Login page - renders LoginForm component.
 */

export default function LoginPage() {
  return <LoginForm />;
}
