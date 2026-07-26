import type { Sale } from '@/types/sale';

export const mockSales: Sale[] = [
  {
    id: 1,
    saleNumber: 'VTA-000088',
    shipmentId: 1,
    shipmentNumber: 'EMB-000075',
    customer: 'Flowers Market USA',
    saleDate: '2026-07-08',
    currency: 'USD',
    paymentStatus: 'PAID',
    totalSale: 3850.0,
  },
  {
    id: 2,
    saleNumber: 'VTA-000089',
    shipmentId: 2,
    shipmentNumber: 'EMB-000076',
    customer: 'NY Flower Imports',
    saleDate: '2026-07-12',
    currency: 'USD',
    paymentStatus: 'PENDING',
    totalSale: 3420.0,
  },
  {
    id: 3,
    saleNumber: 'VTA-000090',
    shipmentId: 3,
    shipmentNumber: 'EMB-000077',
    customer: 'Miami Premium Flowers',
    saleDate: '2026-07-19',
    currency: 'USD',
    paymentStatus: 'OVERDUE',
    totalSale: 3100.0,
  },
];
