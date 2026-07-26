import { z } from 'zod';

export const shipmentSchema = z.object({
  shipmentDate: z.string().min(1, 'La fecha es obligatoria'),
  freightCompany: z.string().min(1, 'La carguera es obligatoria'),
  airline: z.string().min(1, 'La aerolínea es obligatoria'),
  airWaybill: z.string().min(1, 'El número de guía aérea es obligatorio'),
  flightNumber: z.string().min(1, 'El número de vuelo es obligatorio'),
  origin: z.string().min(1, 'El origen es obligatorio'),
  destination: z.string().min(1, 'El destino es obligatorio'),
  customer: z.string().min(1, 'El cliente es obligatorio'),
  boxes: z.coerce.number().int().min(1, 'El número de cajas debe ser mayor a 0'),
  actualWeight: z.coerce.number().min(0.01, 'El peso real debe ser mayor a 0'),
  volumetricWeight: z.coerce.number().min(0.01, 'El peso volumétrico debe ser mayor a 0'),
  ratePerKg: z.coerce.number().min(0.01, 'La tarifa por kg debe ser mayor a 0'),
  status: z.enum(['DRAFT', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export type ShipmentSchemaValues = z.infer<typeof shipmentSchema>;
