'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { ValidationMessages } from '@/messages';

/**
 * @ai-context User profile page for viewing and editing user information.
 */

const profileSchema = z.object({
  first_name: z.string().min(2, ValidationMessages.min(2)),
  last_name: z.string().min(2, ValidationMessages.min(2)),
  email: z.string().email(ValidationMessages.email),
  phone: z.string().optional(),
  current_password: z.string().optional(),
  new_password: z
    .string()
    .min(8, ValidationMessages.min(8))
    .optional()
    .or(z.literal('')),
  new_password_confirmation: z.string().optional(),
}).refine(
  (data) => {
    if (data.new_password) {
      return data.new_password === data.new_password_confirmation;
    }
    return true;
  },
  {
    message: 'Las contraseñas no coinciden',
    path: ['new_password_confirmation'],
  }
);

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      // TODO: Call API to update profile
      console.log('Update profile:', data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mi perfil</h2>
          <p className="mt-2 text-gray-600">Actualiza tu información personal</p>
        </div>
        {!isEditing && (
          <Button size="lg" onClick={() => setIsEditing(true)}>
            Editar perfil
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="mb-8 rounded-xl bg-green-50 border border-green-100 p-6 animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-900">{successMessage}</p>
          </div>
        </div>
      )}

      <Card variant="elevated">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Información personal
              </h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Nombre"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Apellido"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    disabled={!isEditing}
                  />
                </div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  disabled={!isEditing}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  disabled={!isEditing}
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Change Password */}
            {isEditing && (
              <div className="border-t-2 border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Cambiar contraseña
                </h3>
                <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  💡 Deja estos campos en blanco si no deseas cambiar tu contraseña.
                </p>
                <div className="space-y-4">
                  <Input
                    label="Contraseña actual"
                    type="password"
                    {...register('current_password')}
                    error={errors.current_password?.message}
                  />
                  <Input
                    label="Nueva contraseña"
                    type="password"
                    {...register('new_password')}
                    error={errors.new_password?.message}
                  />
                  <Input
                    label="Confirmar nueva contraseña"
                    type="password"
                    {...register('new_password_confirmation')}
                    error={errors.new_password_confirmation?.message}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            {isEditing && (
              <div className="flex gap-4 justify-end border-t-2 border-gray-100 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="shadow-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="gradient-sage"
                  isLoading={isSaving}
                  className="shadow-xl shadow-primary/20"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Guardar cambios
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
