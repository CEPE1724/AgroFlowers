import { z } from 'zod';

const noEdgeSpaces = (message: string) =>
  z.string().refine((value) => value === value.trim(), message);

export const farmSchema = z.object({
  code: noEdgeSpaces('El código no debe tener espacios al inicio ni al final').pipe(
    z.string().min(1, 'El código es obligatorio')
  ),
  name: noEdgeSpaces('El nombre no debe tener espacios al inicio ni al final').pipe(
    z.string().min(1, 'El nombre de la finca es obligatorio')
  ),
  ruc: z.string().regex(/^\d{13}$/, 'El RUC debe tener exactamente 13 dígitos'),
  contactName: z.string().min(1, 'La persona de contacto es obligatoria'),
  phone: z.string().regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos'),
  email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo válido'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  province: z.string().min(1, 'La provincia es obligatoria'),
  address: z.string().optional(),
  creditDays: z.coerce.number().int('Debe ser un número entero').min(0, 'Los días de crédito no pueden ser negativos'),
  rating: z.enum(['EXCELENTE', 'BUENA', 'REGULAR', 'MALA']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  observation: z.string().optional(),
});

export type FarmSchemaValues = z.infer<typeof farmSchema>;
