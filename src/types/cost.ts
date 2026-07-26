export interface Cost {
  id: number;
  shipmentId: number;
  shipmentNumber: string;
  flowerCost: number;
  airFreight: number;
  boxes: number;
  costPerBox: number;
  packing: number;
  costPerLabel: number;
  labels: number;
  taxBase: number;
  taxPercentage: number;
  taxes: number;
  groundTransport: number;
  insurance: number;
  handling: number;
  otherCosts: number;
  otherCostsDescription?: string;
  totalCost: number;
}

export interface CostFormValues {
  shipmentId: number;
  flowerCost: number;
  airFreight: number;
  boxes: number;
  costPerBox: number;
  costPerLabel: number;
  taxBase: number;
  taxPercentage: number;
  groundTransport: number;
  insurance: number;
  handling: number;
  otherCosts: number;
  otherCostsDescription?: string;
}
