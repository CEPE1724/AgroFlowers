export type FarmRating = 'EXCELENTE' | 'BUENA' | 'REGULAR' | 'MALA';
export type RecordStatus = 'ACTIVE' | 'INACTIVE';

export interface Farm {
  id: number;
  code: string;
  name: string;
  ruc: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  province: string;
  address?: string;
  creditDays: number;
  rating: FarmRating;
  status: RecordStatus;
  observation?: string;
  profitMargin: number;
}

export type FarmFormValues = Omit<Farm, 'id' | 'profitMargin'>;
