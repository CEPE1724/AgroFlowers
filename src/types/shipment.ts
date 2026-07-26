export type ShipmentStatus = 'DRAFT' | 'READY' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
  id: number;
  shipmentNumber: string;
  shipmentDate: string;
  freightCompany: string;
  airline: string;
  airWaybill: string;
  flightNumber: string;
  origin: string;
  destination: string;
  customer: string;
  boxes: number;
  actualWeight: number;
  volumetricWeight: number;
  billableWeight: number;
  ratePerKg: number;
  estimatedFreight: number;
  status: ShipmentStatus;
}

export type ShipmentFormValues = Omit<Shipment, 'id' | 'billableWeight' | 'estimatedFreight'>;
