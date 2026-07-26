import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlyTrendPoint } from '@/types/dashboard';
import { formatCurrency } from '@/utils/currency';
import { AXIS_TICK_STYLE } from './chartTheme';

interface Props {
  data: MonthlyTrendPoint[];
}

export function MonthlyTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={AXIS_TICK_STYLE} />
        <YAxis tick={AXIS_TICK_STYLE} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="sales" name="Ventas" stroke="#2a7038" strokeWidth={2.5} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="costs" name="Costos" stroke="#e560ac" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
