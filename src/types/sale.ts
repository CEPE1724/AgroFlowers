export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface SaleDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  saleNumber: string;
  shipmentId: number;
  shipmentNumber: string;
  customer: string;
  saleDate: string;
  currency: string;
  paymentStatus: PaymentStatus;
  observation?: string;
  totalSale: number;
  details?: SaleDetail[];
}

export interface SaleFormValues {
  shipmentId: number;
  customer: string;
  saleDate: string;
  currency: string;
  paymentStatus: PaymentStatus;
  observation?: string;
  details: Array<Omit<SaleDetail, 'subtotal' | 'productId'> & { productId: number }>;
}
