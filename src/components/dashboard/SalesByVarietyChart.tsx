import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SalesByVarietyPoint } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';
import { AXIS_TICK_STYLE } from './chartTheme';

interface Props {
  data: SalesByVarietyPoint[];
}

export function SalesByVarietyChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
        <XAxis type="number" tick={AXIS_TICK_STYLE} />
        <YAxis type="category" dataKey="variety" tick={AXIS_TICK_STYLE} width={90} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="totalSold" fill="#e560ac" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
