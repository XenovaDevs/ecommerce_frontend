'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { ValidationMessages } from '@/messages';
import { authService } from '../services/auth.service';
import { AUTH_VALIDATION } from '../constants';

/**
 * @ai-context Reset password form component.
 *             Uses token from URL to reset user password.
 */

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, ValidationMessages.required)
      .min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH, ValidationMessages.min(AUTH_VALIDATION.PASSWORD_MIN_LENGTH))
      .max(AUTH_VALIDATION.PASSWORD_MAX_LENGTH),
    password_confirmation: z.string().min(1, ValidationMessages.required),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: ValidationMessages.passwordMatch,
    path: ['password_confirmation'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type ApiErrorShape = { response?: { data?: { message?: string } } };

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      setError('El enlace de recuperaciÃ³n es invÃ¡lido o ha expirado.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(
        (err as ApiErrorShape).response?.data?.message ||
        'No pudimos restablecer tu contraseÃ±a. El enlace puede haber expirado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Enlace invÃ¡lido</h2>
          <p className="mt-2 text-sm text-gray-600">
            El enlace de recuperaciÃ³n es invÃ¡lido o ha expirado.
            Solicita uno nuevo.
          </p>
          <div className="mt-6 space-y-3">
            <Link href={ROUTES.FORGOT_PASSWORD} className="block">
              <Button fullWidth>Solicitar nuevo enlace</Button>
            </Link>
            <Link href={ROUTES.LOGIN} className="block">
              <Button variant="ghost" fullWidth>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesiÃ³n
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">ContraseÃ±a restablecida</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu contraseÃ±a fue actualizada correctamente.
            Ya puedes iniciar sesiÃ³n con tu nueva contraseÃ±a.
          </p>
          <Link href={ROUTES.LOGIN} className="mt-6 block">
            <Button fullWidth>{UIMessages.AUTH.LOGIN}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{UIMessages.AUTH.RESET_PASSWORD}</CardTitle>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa tu nueva contraseÃ±a.
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
            {...register('password')}
            type="password"
            label="Nueva contraseÃ±a"
            placeholder="********"
            error={errors.password?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Input
            {...register('password_confirmation')}
            type="password"
            label={UIMessages.AUTH.CONFIRM_PASSWORD}
            placeholder="********"
            error={errors.password_confirmation?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            autoComplete="new-password"
            disabled={isLoading}
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            {UIMessages.AUTH.RESET_PASSWORD}
          </Button>

          <Link
            href={ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesiÃ³n
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}

