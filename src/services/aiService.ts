import type { AiResponse } from '@/types/ai';
import { mockProfitability } from '@/mocks/profitability';
import { mockCosts } from '@/mocks/costs';
import { mockFarms } from '@/mocks/farms';
import { mockDashboardCharts } from '@/mocks/dashboard';
import { apiClient } from './apiClient';
import { formatCurrency, formatPercentage } from '@/utils/currency';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';

export const SUGGESTED_QUESTIONS = [
  '¿Cuál fue la finca más rentable este mes?',
  '¿Qué embarque tuvo mayor costo?',
  '¿Qué variedad tuvo mayores ventas?',
  '¿Por qué EMB-000077 tuvo baja rentabilidad?',
  '¿A qué finca conviene comprar Rosa Freedom?',
  'Resume los costos de EMB-000075.',
  'Muéstrame los embarques con margen inferior al 10%.',
];

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.every((keyword) => text.includes(keyword));
}

function buildMockResponse(question: string): AiResponse {
  const text = question.toLowerCase();

  if (includesAny(text, ['finca', 'rentable'])) {
    return {
      isWarning: false,
      content:
        'Rosas del Valle presenta un margen promedio de 22,40 %, superior al promedio general. Sus principales fortalezas son el menor costo por ramo, menor diferencia entre peso real y peso facturable y estabilidad en los costos de packing.',
    };
  }

  if (includesAny(text, ['embarque', 'mayor', 'costo'])) {
    const highestCost = [...mockCosts].sort((a, b) => b.totalCost - a.totalCost)[0];
    return {
      isWarning: false,
      content: `El embarque con mayor costo registrado es ${highestCost.shipmentNumber}, con un costo total de ${formatCurrency(
        highestCost.totalCost
      )}. El componente más alto fue el costo de flor (${formatCurrency(highestCost.flowerCost)}), seguido del flete aéreo (${formatCurrency(
        highestCost.airFreight
      )}).`,
    };
  }

  if (includesAny(text, ['variedad', 'venta']) || includesAny(text, ['variedad', 'vendida'])) {
    const top = [...mockDashboardCharts.salesByVariety].sort((a, b) => b.totalSold - a.totalSold)[0];
    return {
      isWarning: false,
      content: `La variedad con mayores ventas es ${top.variety}, con ${formatCurrency(
        top.totalSold
      )} en ingresos generados durante el período analizado.`,
    };
  }

  if (includesAny(text, ['077']) || (text.includes('baja') && text.includes('rentabilidad'))) {
    return {
      isWarning: true,
      content:
        'El embarque EMB-000077 tuvo un margen de 7,74 %. Las principales causas fueron un flete elevado de USD 1.025,00, mayor peso volumétrico y una venta total inferior a la esperada. Se recomienda revisar el tipo de caja utilizado y negociar una mejor tarifa por kilogramo.',
    };
  }

  if (includesAny(text, ['finca', 'freedom']) || includesAny(text, ['conviene', 'freedom'])) {
    const bestFarm = [...mockFarms].sort((a, b) => b.profitMargin - a.profitMargin)[0];
    return {
      isWarning: false,
      content: `Se recomienda comprar Rosa Freedom en ${bestFarm.name} (${bestFarm.code}), que mantiene el margen de rentabilidad más alto del sistema (${formatPercentage(
        bestFarm.profitMargin
      )}) y ya tiene historial de compras registradas de esta variedad.`,
    };
  }

  if (includesAny(text, ['resume', '075']) || includesAny(text, ['costos', '075'])) {
    const cost = mockCosts.find((c) => c.shipmentNumber === 'EMB-000075');
    if (cost) {
      return {
        isWarning: false,
        content: `Costos de ${cost.shipmentNumber}: flor ${formatCurrency(cost.flowerCost)}, flete aéreo ${formatCurrency(
          cost.airFreight
        )}, empaque ${formatCurrency(cost.packing)}, etiquetas ${formatCurrency(cost.labels)}, impuestos ${formatCurrency(
          cost.taxes
        )} y otros rubros logísticos. Costo total: ${formatCurrency(cost.totalCost)}.`,
      };
    }
  }

  if (includesAny(text, ['margen', 'inferior']) || includesAny(text, ['margen', '10'])) {
    const lowMargin = mockProfitability.filter((r) => r.profitMargin < 10);
    if (lowMargin.length === 0) {
      return { isWarning: false, content: 'No hay embarques con margen inferior al 10 % en el período analizado.' };
    }
    const list = lowMargin.map((r) => `${r.shipmentNumber} (${formatPercentage(r.profitMargin)})`).join(', ');
    return {
      isWarning: true,
      content: `Se encontraron ${lowMargin.length} embarque(s) con margen inferior al 10 %: ${list}. Se recomienda revisar sus costos logísticos antes de repetir esa ruta o cliente.`,
    };
  }

  return {
    isWarning: false,
    content:
      'No tengo información específica para esa consulta todavía. Puedes preguntarme sobre rentabilidad por finca, embarques con mayor costo, variedades más vendidas o el detalle de costos de un embarque específico.',
  };
}

export async function askAssistant(question: string): Promise<AiResponse> {
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return buildMockResponse(question);
  }
  const { data } = await apiClient.post<AiResponse>('/ai/assistant', { question }, { timeout: 120000 });
  return data;
}
