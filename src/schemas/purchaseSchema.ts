import { z } from 'zod';

export const purchaseDetailSchema = z.object({
  flowerId: z.coerce.number().int().min(1, 'Selecciona una flor'),
  quantityBouquets: z.coerce.number().int().min(1, 'La cantidad de ramos debe ser mayor a 0'),
  stemsPerBouquet: z.coerce.number().int().min(1, 'Los tallos por ramo deben ser mayor a 0'),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser mayor a 0'),
});

export const purchaseSchema = z.object({
  purchaseDate: z.string().min(1, 'La fecha es obligatoria'),
  farmId: z.coerce.number().int().min(1, 'Selecciona una finca'),
  responsible: z.string().min(1, 'El responsable es obligatorio'),
  observation: z.string().optional(),
  details: z.array(purchaseDetailSchema).min(1, 'Agrega al menos una línea de detalle'),
});

export type PurchaseSchemaValues = z.infer<typeof purchaseSchema>;
