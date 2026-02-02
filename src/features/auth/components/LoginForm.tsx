'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Button, Input, Checkbox, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { useLogin } from '../hooks';
import { loginSchema, type LoginFormData } from '../constants';

/**
 * @ai-context Login form component with email/password authentication.
 * @ai-flow
 *   1. User enters credentials
 *   2. Form validates with Zod schema
 *   3. On submit: calls login hook
 *   4. On success: redirects to home (handled by context)
 *   5. On error: displays error message
 * @ai-a11y
 *   - Labels associated with inputs
 *   - Error messages linked to inputs
 *   - Focus management on error
 */

export function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{UIMessages.AUTH.LOGIN}</CardTitle>
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

          <Input
            {...register('password')}
            type="password"
            label={UIMessages.AUTH.PASSWORD}
            placeholder="********"
            error={errors.password?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            autoComplete="current-password"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              {...register('remember')}
              label={UIMessages.AUTH.REMEMBER_ME}
              disabled={isLoading}
            />
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              {UIMessages.AUTH.FORGOT_PASSWORD}
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            {UIMessages.AUTH.LOGIN}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {UIMessages.AUTH.NO_ACCOUNT}{' '}
            <Link href={ROUTES.REGISTER} className="text-primary hover:underline">
              {UIMessages.AUTH.REGISTER}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
