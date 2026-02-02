/**
 * @ai-context Validation messages for form validation.
 *             Used with react-hook-form and Zod schemas.
 */

export const ValidationMessages = {
  required: 'Este campo es requerido',
  email: 'Por favor, ingresa un email válido',
  min: (min: number) => `Debe tener al menos ${min} caracteres`,
  max: (max: number) => `Debe tener como máximo ${max} caracteres`,
  minValue: (min: number) => `El valor mínimo es ${min}`,
  maxValue: (max: number) => `El valor máximo es ${max}`,
  pattern: 'El formato no es válido',
  passwordMatch: 'Las contraseñas no coinciden',
  phone: 'Por favor, ingresa un número de teléfono válido',
  postalCode: 'Por favor, ingresa un código postal válido',
  url: 'Por favor, ingresa una URL válida',
  number: 'Debe ser un número',
  integer: 'Debe ser un número entero',
  positive: 'Debe ser un número positivo',
  date: 'Por favor, ingresa una fecha válida',
  futureDate: 'La fecha debe ser en el futuro',
  pastDate: 'La fecha debe ser en el pasado',
} as const;
