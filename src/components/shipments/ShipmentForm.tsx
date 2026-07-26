import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { shipmentSchema, type ShipmentSchemaValues } from '@/schemas/shipmentSchema';
import { createShipment, updateShipment } from '@/services/shipmentService';
import { formatCurrency, round2 } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { toInputDate } from '@/utils/dates';
import type { Shipment } from '@/types/shipment';

interface Props {
  shipment?: Shipment;
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'READY', label: 'Listo' },
  { value: 'SHIPPED', label: 'Embarcado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export function ShipmentForm({ shipment }: Props) {
  const isEditing = Boolean(shipment);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentSchemaValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: shipment
      ? { ...shipment, shipmentDate: toInputDate(shipment.shipmentDate) }
      : {
          shipmentDate: toInputDate(new Date()),
          freightCompany: '',
          airline: '',
          airWaybill: '',
          flightNumber: '',
          origin: 'Quito',
          destination: '',
          customer: '',
          boxes: 1,
          actualWeight: 0,
          volumetricWeight: 0,
          ratePerKg: 0,
          status: 'DRAFT',
        },
  });

  const [actualWeight, volumetricWeight, ratePerKg] = watch(['actualWeight', 'volumetricWeight', 'ratePerKg']);

  const preview = useMemo(() => {
    const billableWeight = Math.max(Number(actualWeight) || 0, Number(volumetricWeight) || 0);
    const estimatedFreight = round2(billableWeight * (Number(ratePerKg) || 0));
    return { billableWeight, estimatedFreight };
  }, [actualWeight, volumetricWeight, ratePerKg]);

  async function onSubmit(values: ShipmentSchemaValues) {
    setSubmitError(null);
    try {
      if (isEditing && shipment) {
        await updateShipment(shipment.id, values);
        toast.success('Embarque actualizado correctamente');
        window.location.href = `/shipments/${shipment.id}`;
      } else {
        const created = await createShipment(values);
        toast.success(`Embarque ${created.shipmentNumber} registrado correctamente`);
        window.location.href = `/shipments/${created.id}`;
      }
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Datos del embarque</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Fecha" type="date" required error={errors.shipmentDate?.message} {...register('shipmentDate')} />
          <Input label="Carguera" required error={errors.freightCompany?.message} {...register('freightCompany')} />
          <Input label="Aerolínea" required error={errors.airline?.message} {...register('airline')} />
          <Input label="N° guía aérea" required error={errors.airWaybill?.message} {...register('airWaybill')} />
          <Input label="N° de vuelo" required error={errors.flightNumber?.message} {...register('flightNumber')} />
          <Select label="Estado" required options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
          <Input label="Origen" required error={errors.origin?.message} {...register('origin')} />
          <Input label="Destino" required error={errors.destination?.message} {...register('destination')} />
          <Input label="Cliente" required error={errors.customer?.message} {...register('customer')} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Peso y flete</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Número de cajas" type="number" min={1} required error={errors.boxes?.message} {...register('boxes')} />
          <Input
            label="Peso real (kg)"
            type="number"
            step="0.01"
            min={0}
            required
            error={errors.actualWeight?.message}
            {...register('actualWeight')}
          />
          <Input
            label="Peso volumétrico (kg)"
            type="number"
            step="0.01"
            min={0}
            required
            error={errors.volumetricWeight?.message}
            {...register('volumetricWeight')}
          />
          <Input
            label="Tarifa por kg"
            type="number"
            step="0.01"
            min={0}
            required
            error={errors.ratePerKg?.message}
            {...register('ratePerKg')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl bg-primary-50/60 p-4 dark:bg-primary-900/20 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-primary-400">Peso facturable (mayor entre real y volumétrico)</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{preview.billableWeight.toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-primary-400">Flete estimado</p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-50">{formatCurrency(preview.estimatedFreight)}</p>
          </div>
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
          {isEditing ? 'Guardar cambios' : 'Registrar embarque'}
        </Button>
      </div>
    </form>
  );
}
