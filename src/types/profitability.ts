export type ProfitabilityClassification = 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'LOW';

export interface ProfitabilityRecord {
  shipmentId: number;
  shipmentNumber: string;
  shipmentDate: string;
  farmName: string;
  customer: string;
  totalSale: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  classification: ProfitabilityClassification;
}

export interface ProfitabilityFilters {
  dateFrom?: string;
  dateTo?: string;
  farmName?: string;
  customer?: string;
  shipmentNumber?: string;
  classification?: ProfitabilityClassification;
  minMargin?: number;
  maxMargin?: number;
}
