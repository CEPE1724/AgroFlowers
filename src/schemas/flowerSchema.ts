import { z } from 'zod';

export const flowerSchema = z.object({
  flowerType: z.string().min(1, 'El tipo de flor es obligatorio'),
  variety: z.string().min(1, 'La variedad es obligatoria'),
  color: z.string().min(1, 'El color es obligatorio'),
  stemLength: z.coerce.number().int().min(1, 'La longitud del tallo debe ser mayor a 0'),
  stemsPerBouquet: z.coerce.number().int().min(1, 'Los tallos por ramo deben ser mayor a 0'),
  purchaseUnit: z.enum(['RAMO', 'TALLO', 'CAJA']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type FlowerSchemaValues = z.infer<typeof flowerSchema>;
