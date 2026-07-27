import { z } from 'zod';

const noEdgeSpaces = (message: string) =>
  z.string().refine((value) => value === value.trim(), message);

export const adminUserSchema = z.object({
  username: noEdgeSpaces('El usuario no debe tener espacios al inicio ni al final').pipe(
    z
      .string()
      .min(4, 'El usuario debe tener al menos 4 caracteres')
      .max(50, 'El usuario no debe superar los 50 caracteres')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Solo se permiten letras, números, puntos, guiones y guion bajo')
  ),
  email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo válido'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['ADMIN', 'SUPERVISOR']),
});

export type AdminUserSchemaValues = z.infer<typeof adminUserSchema>;
