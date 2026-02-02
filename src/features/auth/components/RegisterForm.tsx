'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { ROUTES } from '@/constants';
import { UIMessages } from '@/messages';
import { useRegister } from '../hooks';
import { registerSchema, type RegisterFormData } from '../constants';

/**
 * @ai-context Registration form component for new user signup.
 * @ai-flow
 *   1. User fills registration form
 *   2. Form validates with Zod schema (including password match)
 *   3. On submit: calls register hook
 *   4. On success: redirects to home (handled by context)
 *   5. On error: displays error message
 * @ai-a11y
 *   - Labels associated with inputs
 *   - Error messages linked to inputs
 *   - Password confirmation validation
 */

export function RegisterForm() {
  const { register: registerUser, isLoading, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{UIMessages.AUTH.REGISTER}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('first_name')}
              label={UIMessages.AUTH.FIRST_NAME}
              placeholder="Juan"
              error={errors.first_name?.message}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="given-name"
              disabled={isLoading}
            />

            <Input
              {...register('last_name')}
              label={UIMessages.AUTH.LAST_NAME}
              placeholder="Pérez"
              error={errors.last_name?.message}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="family-name"
              disabled={isLoading}
            />
          </div>

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
            {...register('phone')}
            type="tel"
            label={`Teléfono (${UIMessages.COMMON.OPTIONAL.toLowerCase()})`}
            placeholder="+54 11 1234-5678"
            error={errors.phone?.message}
            leftIcon={<Phone className="h-4 w-4" />}
            autoComplete="tel"
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

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            {UIMessages.AUTH.REGISTER}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {UIMessages.AUTH.HAS_ACCOUNT}{' '}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
              {UIMessages.AUTH.LOGIN}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
