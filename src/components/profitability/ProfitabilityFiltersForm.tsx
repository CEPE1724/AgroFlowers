import { Download, X } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import type { ProfitabilityClassification, ProfitabilityFilters } from '@/types/profitability';

interface Props {
  filters: ProfitabilityFilters;
  onChange: (filters: ProfitabilityFilters) => void;
  onExport: () => void;
  hasResults: boolean;
}

const CLASSIFICATION_OPTIONS = [
  { value: 'EXCELLENT', label: 'Excelente' },
  { value: 'GOOD', label: 'Buena' },
  { value: 'ACCEPTABLE', label: 'Aceptable' },
  { value: 'LOW', label: 'Baja' },
];

export function ProfitabilityFiltersForm({ filters, onChange, onExport, hasResults }: Props) {
  function set<K extends keyof ProfitabilityFilters>(key: K, value: ProfitabilityFilters[K]) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="card space-y-4 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="Desde" type="date" value={filters.dateFrom ?? ''} onChange={(e) => set('dateFrom', e.target.value)} />
        <Input label="Hasta" type="date" value={filters.dateTo ?? ''} onChange={(e) => set('dateTo', e.target.value)} />
        <Input label="Finca" placeholder="Nombre de finca" value={filters.farmName ?? ''} onChange={(e) => set('farmName', e.target.value)} />
        <Input label="Cliente" placeholder="Nombre de cliente" value={filters.customer ?? ''} onChange={(e) => set('customer', e.target.value)} />
        <Input label="Embarque" placeholder="EMB-000000" value={filters.shipmentNumber ?? ''} onChange={(e) => set('shipmentNumber', e.target.value)} />
        <Select
          label="Clasificación"
          placeholder="Todas"
          options={CLASSIFICATION_OPTIONS}
          value={filters.classification ?? ''}
          onChange={(e) => set('classification', (e.target.value || undefined) as ProfitabilityClassification | undefined)}
        />
        <Input
          label="Margen mínimo (%)"
          type="number"
          step="0.01"
          value={filters.minMargin ?? ''}
          onChange={(e) => set('minMargin', e.target.value === '' ? undefined : Number(e.target.value))}
        />
        <Input
          label="Margen máximo (%)"
          type="number"
          step="0.01"
          value={filters.maxMargin ?? ''}
          onChange={(e) => set('maxMargin', e.target.value === '' ? undefined : Number(e.target.value))}
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-primary-100 pt-4 dark:border-primary-900/40">
        <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => onChange({})}>
          Limpiar filtros
        </Button>
        <Button size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={onExport} disabled={!hasResults}>
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}
