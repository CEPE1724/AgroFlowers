import { z } from 'zod';

export const costSchema = z.object({
  shipmentId: z.coerce.number().int().min(1, 'Selecciona un embarque'),
  flowerCost: z.coerce.number().min(0, 'El costo de flor no puede ser negativo'),
  airFreight: z.coerce.number().min(0, 'El flete aéreo no puede ser negativo'),
  boxes: z.coerce.number().int().min(1, 'El número de cajas debe ser mayor a 0'),
  costPerBox: z.coerce.number().min(0, 'El costo por caja no puede ser negativo'),
  costPerLabel: z.coerce.number().min(0, 'El costo por etiqueta no puede ser negativo'),
  taxBase: z.coerce.number().min(0, 'La base imponible no puede ser negativa'),
  taxPercentage: z.coerce.number().min(0, 'El porcentaje de impuesto no puede ser negativo'),
  groundTransport: z.coerce.number().min(0, 'El transporte terrestre no puede ser negativo'),
  insurance: z.coerce.number().min(0, 'El seguro no puede ser negativo'),
  handling: z.coerce.number().min(0, 'El manejo de carga no puede ser negativo'),
  otherCosts: z.coerce.number().min(0, 'Otros costos no pueden ser negativos'),
  otherCostsDescription: z.string().optional(),
});

export type CostSchemaValues = z.infer<typeof costSchema>;
