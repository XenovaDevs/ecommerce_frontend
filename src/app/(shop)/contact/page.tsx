'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, Input, Textarea } from '@/components/ui';
import { contactService } from '@/services';
import type { CreateContactMessageData } from '@/types';

/**
 * @ai-context Contact form page for customer inquiries.
 *             Public page using react-hook-form with Zod validation.
 * @ai-flow
 *   1. User fills out contact form
 *   2. Client-side validation with Zod
 *   3. Submit to backend API
 *   4. Show success/error state
 */

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255),
  email: z.string().email('Ingrese un email válido').max(255),
  phone: z.string().max(20).optional().or(z.literal('')),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres').max(255),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(5000, 'El mensaje no puede exceder 5000 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const payload: CreateContactMessageData = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        subject: data.subject,
        message: data.message,
      };

      await contactService.submit(payload);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">
              ¡Mensaje enviado con éxito!
            </h2>
            <p className="mb-6 text-gray-600">
              Hemos recibido tu mensaje y te responderemos lo antes posible.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="gradient-sage">
              Enviar otro mensaje
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 animate-slide-up text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Contáctanos</h1>
        <p className="mt-4 text-lg text-gray-600">
          ¿Tienes alguna pregunta o sugerencia? Completa el formulario y nos pondremos en contacto
          contigo.
        </p>
      </div>

      <Card className="animate-slide-up [animation-delay:100ms]">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Teléfono (opcional)"
                type="tel"
                placeholder="+54 11 1234-5678"
                leftIcon={<Phone className="h-4 w-4" />}
                error={errors.phone?.message}
                {...register('phone')}
              />

              <Input
                label="Asunto"
                placeholder="Motivo de tu consulta"
                leftIcon={<MessageSquare className="h-4 w-4" />}
                error={errors.subject?.message}
                {...register('subject')}
              />
            </div>

            <Textarea
              label="Mensaje"
              placeholder="Escribe tu mensaje aquí..."
              rows={6}
              error={errors.message?.message}
              {...register('message')}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                variant="gradient-sage"
                disabled={isSubmitting}
                className="min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensaje
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Card className="animate-slide-up [animation-delay:200ms]">
          <CardContent className="p-6 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
            <p className="text-sm text-gray-600">contacto@lepas.com</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up [animation-delay:300ms]">
          <CardContent className="p-6 text-center">
            <Phone className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 font-semibold text-gray-900">Teléfono</h3>
            <p className="text-sm text-gray-600">+54 11 1234-5678</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up [animation-delay:400ms]">
          <CardContent className="p-6 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="mb-1 font-semibold text-gray-900">Horario</h3>
            <p className="text-sm text-gray-600">Lun - Vie: 9:00 - 18:00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
