import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea una cuenta nueva',
};

/**
 * @ai-context Register page - renders RegisterForm component.
 */

export default function RegisterPage() {
  return <RegisterForm />;
}
