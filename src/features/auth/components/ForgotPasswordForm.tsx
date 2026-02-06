'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { ValidationMessages } from '@/messages';
import { authService } from '../services/auth.service';
import { AUTH_VALIDATION } from '../constants';

/**
 * @ai-context Forgot password form component.
 *             Sends password reset email to the user.
 */

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, ValidationMessages.required)
    .email(ValidationMessages.email)
    .max(AUTH_VALIDATION.EMAIL_MAX_LENGTH),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(data);
      setSentEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'No pudimos enviar el email. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Revisa tu email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enviamos un enlace de recuperación a{' '}
            <span className="font-medium text-gray-900">{sentEmail}</span>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Si no ves el email, revisa tu carpeta de spam.
          </p>
          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsSuccess(false);
                setError(null);
              }}
            >
              Reenviar email
            </Button>
            <Link href={ROUTES.LOGIN} className="block">
              <Button variant="ghost" fullWidth>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{UIMessages.AUTH.FORGOT_PASSWORD}</CardTitle>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Input
            {...register('email')}
            type="email"
            label={UIMessages.AUTH.EMAIL}
            placeholder="tu@email.com"
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            disabled={isLoading}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Enviar enlace de recuperación
          </Button>

          <Link
            href={ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
