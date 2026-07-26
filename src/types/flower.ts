import type { RecordStatus } from './farm';

export type PurchaseUnit = 'RAMO' | 'TALLO' | 'CAJA';

export interface Flower {
  id: number;
  code: string;
  flowerType: string;
  variety: string;
  color: string;
  stemLength: number;
  stemsPerBouquet: number;
  purchaseUnit: PurchaseUnit;
  status: RecordStatus;
}

export type FlowerFormValues = Omit<Flower, 'id'>;
