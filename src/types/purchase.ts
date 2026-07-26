export type PurchaseStatus = 'DRAFT' | 'REGISTERED' | 'CANCELLED';

export interface PurchaseDetail {
  flowerId: number;
  flowerName: string;
  quantityBouquets: number;
  stemsPerBouquet: number;
  totalStems: number;
  unitPrice: number;
  subtotal: number;
}

export interface Purchase {
  id: number;
  purchaseNumber: string;
  purchaseDate: string;
  farmId: number;
  farmName: string;
  status: PurchaseStatus;
  responsible: string;
  observation?: string;
  total: number;
  details: PurchaseDetail[];
}

export interface PurchaseDetailFormValues {
  flowerId: number;
  quantityBouquets: number;
  stemsPerBouquet: number;
  unitPrice: number;
}

export interface PurchaseFormValues {
  purchaseDate: string;
  farmId: number;
  responsible: string;
  observation?: string;
  details: PurchaseDetailFormValues[];
}
