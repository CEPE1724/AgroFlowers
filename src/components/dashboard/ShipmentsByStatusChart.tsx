import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ShipmentsByStatusPoint } from '@/types/dashboard';
import { SHIPMENT_STATUS_MAP } from '@/utils/statusMaps';
import { STATUS_CHART_COLORS } from './chartTheme';

interface Props {
  data: ShipmentsByStatusPoint[];
}

export function ShipmentsByStatusChart({ data }: Props) {
  const chartData = data.map((point) => ({
    name: SHIPMENT_STATUS_MAP[point.status].label,
    value: point.count,
    status: point.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={95}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
