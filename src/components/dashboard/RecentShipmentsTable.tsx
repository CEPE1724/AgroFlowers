import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/utils/dates';
import { SHIPMENT_STATUS_MAP } from '@/utils/statusMaps';
import type { RecentShipmentRow } from '@/mocks/dashboard';
import type { ShipmentStatus } from '@/types/shipment';

interface Props {
  data: RecentShipmentRow[];
  isLoading: boolean;
}

const columns: DataTableColumn<RecentShipmentRow>[] = [
  { key: 'shipmentNumber', header: 'Embarque', render: (row) => <span className="font-medium text-primary-800 dark:text-primary-100">{row.shipmentNumber}</span> },
  { key: 'shipmentDate', header: 'Fecha', render: (row) => formatDate(row.shipmentDate) },
  { key: 'destination', header: 'Destino', render: (row) => row.destination },
  { key: 'customer', header: 'Cliente', render: (row) => row.customer },
  {
    key: 'status',
    header: 'Estado',
    render: (row) => {
      const meta = SHIPMENT_STATUS_MAP[row.status as ShipmentStatus];
      return <StatusBadge label={meta.label} tone={meta.tone} />;
    },
  },
];

export function RecentShipmentsTable({ data, isLoading }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      isLoading={isLoading}
      emptyTitle="Sin embarques recientes"
      emptyDescription="Cuando se registren embarques aparecerán aquí."
    />
  );
}
