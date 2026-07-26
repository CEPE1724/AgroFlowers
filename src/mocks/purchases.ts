import type { Purchase } from '@/types/purchase';

export const mockPurchases: Purchase[] = [
  {
    id: 1,
    purchaseNumber: 'CMP-000001',
    purchaseDate: '2026-07-01',
    farmId: 1,
    farmName: 'Rosas del Valle',
    status: 'REGISTERED',
    responsible: 'Edison Cepeda',
    total: 1250.0,
    details: [
      {
        flowerId: 1,
        flowerName: 'Rosa Freedom 50 cm',
        quantityBouquets: 120,
        stemsPerBouquet: 25,
        totalStems: 3000,
        unitPrice: 6.25,
        subtotal: 750.0,
      },
      {
        flowerId: 2,
        flowerName: 'Rosa Mondial 60 cm',
        quantityBouquets: 80,
        stemsPerBouquet: 25,
        totalStems: 2000,
        unitPrice: 6.25,
        subtotal: 500.0,
      },
    ],
  },
  {
    id: 2,
    purchaseNumber: 'CMP-000002',
    purchaseDate: '2026-07-05',
    farmId: 2,
    farmName: 'Flor Andina',
    status: 'REGISTERED',
    responsible: 'Ana Morales',
    total: 980.0,
    details: [
      {
        flowerId: 3,
        flowerName: 'Rosa Explorer 50 cm',
        quantityBouquets: 140,
        stemsPerBouquet: 25,
        totalStems: 3500,
        unitPrice: 7.0,
        subtotal: 980.0,
      },
    ],
  },
];
