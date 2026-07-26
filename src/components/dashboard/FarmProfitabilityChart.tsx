import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import type { FarmProfitabilityPoint } from '@/types/dashboard';
import { CHART_COLORS, AXIS_TICK_STYLE } from './chartTheme';

interface Props {
  data: FarmProfitabilityPoint[];
}

export function FarmProfitabilityChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="farmName" tick={AXIS_TICK_STYLE} />
        <YAxis tick={AXIS_TICK_STYLE} unit="%" />
        <Tooltip formatter={(value: number) => [`${value.toFixed(2)} %`, 'Margen']} />
        <Bar dataKey="profitMargin" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.farmName} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
