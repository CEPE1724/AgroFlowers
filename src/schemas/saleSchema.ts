import { z } from 'zod';

export const saleDetailSchema = z.object({
  productId: z.coerce.number().int().min(1, 'Selecciona un producto'),
  productName: z.string().min(1),
  quantity: z.coerce.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser mayor a 0'),
});

export const saleSchema = z.object({
  shipmentId: z.coerce.number().int().min(1, 'Selecciona un embarque'),
  customer: z.string().min(1, 'El cliente es obligatorio'),
  saleDate: z.string().min(1, 'La fecha es obligatoria'),
  currency: z.string().min(1, 'La moneda es obligatoria'),
  paymentStatus: z.enum(['PAID', 'PENDING', 'OVERDUE']),
  observation: z.string().optional(),
  details: z.array(saleDetailSchema).min(1, 'Agrega al menos un producto'),
});

export type SaleSchemaValues = z.infer<typeof saleSchema>;
