import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { costSchema, type CostSchemaValues } from '@/schemas/costSchema';
import { createCost, computeCostTotals } from '@/services/costService';
import { listAllShipments } from '@/services/shipmentService';
import { formatCurrency } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import type { Shipment } from '@/types/shipment';

export function CostForm() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    listAllShipments()
      .then(setShipments)
      .finally(() => setIsLoadingOptions(false));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CostSchemaValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      shipmentId: 0,
      flowerCost: 0,
      airFreight: 0,
      boxes: 1,
      costPerBox: 2.0,
      costPerLabel: 1.5,
      taxBase: 0,
      taxPercentage: 16.8,
      groundTransport: 0,
      insurance: 0,
      handling: 0,
      otherCosts: 0,
      otherCostsDescription: '',
    },
  });

  const values = watch();

  const totals = useMemo(() => computeCostTotals(values), [values]);

  function handleShipmentChange(shipmentId: number) {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      setValue('boxes', shipment.boxes);
      setValue('airFreight', shipment.estimatedFreight);
    }
  }

  async function onSubmit(formValues: CostSchemaValues) {
    setSubmitError(null);
    try {
      const created = await createCost(formValues);
      toast.success(`Costos del embarque ${created.shipmentNumber} registrados correctamente`);
      window.location.href = `/costs/${created.shipmentId}`;
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoadingOptions) return <LoadingSpinner label="Cargando embarques..." />;

  const shipmentOptions = shipments.map((s) => ({ value: s.id, label: `${s.shipmentNumber} · ${s.customer}` }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Embarque</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Embarque"
            required
            placeholder="Selecciona un embarque"
            options={shipmentOptions}
            error={errors.shipmentId?.message}
            {...register('shipmentId', { onChange: (e) => handleShipmentChange(Number(e.target.value)) })}
          />
          <Input label="N° de cajas" type="number" min={1} required error={errors.boxes?.message} {...register('boxes')} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Costos directos</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Costo de flor" type="number" step="0.01" min={0} error={errors.flowerCost?.message} {...register('flowerCost')} />
          <Input label="Flete aéreo" type="number" step="0.01" min={0} error={errors.airFreight?.message} {...register('airFreight')} />
          <Input label="Costo por caja" type="number" step="0.01" min={0} error={errors.costPerBox?.message} {...register('costPerBox')} />
          <Input label="Costo por etiqueta" type="number" step="0.01" min={0} error={errors.costPerLabel?.message} {...register('costPerLabel')} />
          <Input label="Base imponible" type="number" step="0.01" min={0} error={errors.taxBase?.message} {...register('taxBase')} />
          <Input label="% de impuestos" type="number" step="0.01" min={0} error={errors.taxPercentage?.message} {...register('taxPercentage')} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Otros costos</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Transporte terrestre" type="number" step="0.01" min={0} error={errors.groundTransport?.message} {...register('groundTransport')} />
          <Input label="Seguro" type="number" step="0.01" min={0} error={errors.insurance?.message} {...register('insurance')} />
          <Input label="Manejo de carga" type="number" step="0.01" min={0} error={errors.handling?.message} {...register('handling')} />
          <Input label="Otros costos" type="number" step="0.01" min={0} error={errors.otherCosts?.message} {...register('otherCosts')} />
          <Input label="Descripción de otros costos" error={errors.otherCostsDescription?.message} {...register('otherCostsDescription')} />
        </div>
      </div>

      <div className="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-primary-400">Empaque</p>
          <p className="font-semibold text-primary-800 dark:text-primary-100">{formatCurrency(totals.packing)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-primary-400">Etiquetas</p>
          <p className="font-semibold text-primary-800 dark:text-primary-100">{formatCurrency(totals.labels)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-primary-400">Impuestos</p>
          <p className="font-semibold text-primary-800 dark:text-primary-100">{formatCurrency(totals.taxes)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-primary-400">Costo total</p>
          <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatCurrency(totals.totalCost)}</p>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" leftIcon={<Save className="h-4 w-4" />} isLoading={isSubmitting}>
          Registrar costos
        </Button>
      </div>
    </form>
  );
}
