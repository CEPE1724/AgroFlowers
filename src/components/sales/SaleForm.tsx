import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { saleSchema, type SaleSchemaValues } from '@/schemas/saleSchema';
import { createSale } from '@/services/saleService';
import { listAllShipments } from '@/services/shipmentService';
import { listAllFlowers } from '@/services/flowerService';
import { formatCurrency, round2 } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { toInputDate } from '@/utils/dates';
import type { Shipment } from '@/types/shipment';
import type { Flower } from '@/types/flower';

const PAYMENT_OPTIONS = [
  { value: 'PAID', label: 'Pagado' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'OVERDUE', label: 'Vencido' },
];

export function SaleForm() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAllShipments(), listAllFlowers()])
      .then(([shipmentList, flowerList]) => {
        setShipments(shipmentList);
        setFlowers(flowerList.filter((f) => f.status === 'ACTIVE'));
      })
      .finally(() => setIsLoadingOptions(false));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SaleSchemaValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      shipmentId: 0,
      customer: '',
      saleDate: toInputDate(new Date()),
      currency: 'USD',
      paymentStatus: 'PENDING',
      observation: '',
      details: [{ productId: 0, productName: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'details' });
  const watchedDetails = watch('details');

  const subtotals = useMemo(
    () => watchedDetails.map((d) => round2((Number(d.quantity) || 0) * (Number(d.unitPrice) || 0))),
    [watchedDetails]
  );
  const grandTotal = round2(subtotals.reduce((sum, value) => sum + value, 0));

  function handleShipmentChange(shipmentId: number) {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      setValue('customer', shipment.customer);
    }
  }

  function handleProductChange(index: number, flowerId: number) {
    const flower = flowers.find((f) => f.id === flowerId);
    if (flower) {
      setValue(`details.${index}.productId`, flower.id);
      setValue(`details.${index}.productName`, `${flower.flowerType} ${flower.variety} ${flower.stemLength}cm`);
    }
  }

  async function onSubmit(values: SaleSchemaValues) {
    setSubmitError(null);
    try {
      const created = await createSale(values);
      toast.success(`Venta ${created.saleNumber} registrada correctamente`);
      window.location.href = `/sales/${created.id}`;
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoadingOptions) return <LoadingSpinner label="Cargando embarques y productos..." />;

  const shipmentOptions = shipments.map((s) => ({ value: s.id, label: `${s.shipmentNumber} · ${s.customer}` }));
  const flowerOptions = flowers.map((f) => ({ value: f.id, label: `${f.flowerType} ${f.variety} ${f.stemLength}cm` }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Datos de la venta</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Embarque"
            required
            placeholder="Selecciona un embarque"
            options={shipmentOptions}
            error={errors.shipmentId?.message}
            {...register('shipmentId', { onChange: (e) => handleShipmentChange(Number(e.target.value)) })}
          />
          <Input label="Cliente" required error={errors.customer?.message} {...register('customer')} />
          <Input label="Fecha" type="date" required error={errors.saleDate?.message} {...register('saleDate')} />
          <Input label="Moneda" required error={errors.currency?.message} {...register('currency')} />
          <Select
            label="Estado de pago"
            required
            options={PAYMENT_OPTIONS}
            error={errors.paymentStatus?.message}
            {...register('paymentStatus')}
          />
          <Input label="Observación" error={errors.observation?.message} {...register('observation')} />
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Detalle de productos</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => append({ productId: 0, productName: '', quantity: 1, unitPrice: 0 })}
          >
            Agregar línea
          </Button>
        </div>

        {typeof errors.details?.message === 'string' && <p className="mb-2 text-sm text-red-600">{errors.details.message}</p>}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-xl border border-primary-100 p-3 dark:border-primary-900/40 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <Select
                  label={index === 0 ? 'Producto' : undefined}
                  placeholder="Selecciona un producto"
                  options={flowerOptions}
                  error={errors.details?.[index]?.productId?.message}
                  onChange={(e) => handleProductChange(index, Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={index === 0 ? 'Cantidad' : undefined}
                  type="number"
                  min={1}
                  error={errors.details?.[index]?.quantity?.message}
                  {...register(`details.${index}.quantity`)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={index === 0 ? 'Precio unitario' : undefined}
                  type="number"
                  step="0.01"
                  min={0}
                  error={errors.details?.[index]?.unitPrice?.message}
                  {...register(`details.${index}.unitPrice`)}
                />
              </div>
              <div className="flex items-end justify-between gap-2 sm:col-span-3">
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-200">{formatCurrency(subtotals[index] ?? 0)}</p>
                <button
                  type="button"
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length === 1}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950/30"
                  aria-label="Eliminar línea"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end border-t border-primary-100 pt-4 dark:border-primary-900/40">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-primary-400">Total vendido</p>
            <p className="text-xl font-bold text-primary-900 dark:text-primary-50">{formatCurrency(grandTotal)}</p>
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
          Registrar venta
        </Button>
      </div>
    </form>
  );
}
