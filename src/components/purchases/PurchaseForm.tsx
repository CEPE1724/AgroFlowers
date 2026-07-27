import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { purchaseSchema, type PurchaseSchemaValues } from '@/schemas/purchaseSchema';
import { createPurchase } from '@/services/purchaseService';
import { listAllFarms } from '@/services/farmService';
import { listAllFlowers } from '@/services/flowerService';
import { formatCurrency, round2 } from '@/utils/currency';
import { getErrorMessage } from '@/utils/errors';
import { toInputDate } from '@/utils/dates';
import type { Farm } from '@/types/farm';
import type { Flower } from '@/types/flower';

export function PurchaseForm() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listAllFarms(), listAllFlowers()])
      .then(([farmList, flowerList]) => {
        setFarms(farmList.filter((f) => f.status === 'ACTIVE'));
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
  } = useForm<PurchaseSchemaValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchaseDate: toInputDate(new Date()),
      farmId: 0,
      responsible: '',
      observation: '',
      details: [{ flowerId: 0, quantityBouquets: 1, stemsPerBouquet: 25, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'details' });
  const watchedDetails = watch('details');

  const rowsWithTotals = useMemo(
    () =>
      watchedDetails.map((detail) => ({
        totalStems: (Number(detail.quantityBouquets) || 0) * (Number(detail.stemsPerBouquet) || 0),
        subtotal: round2((Number(detail.quantityBouquets) || 0) * (Number(detail.unitPrice) || 0)),
      })),
    [watchedDetails]
  );

  const grandTotal = round2(rowsWithTotals.reduce((sum, row) => sum + row.subtotal, 0));

  function handleFlowerChange(index: number, flowerId: number) {
    const flower = flowers.find((f) => f.id === flowerId);
    if (flower) {
      setValue(`details.${index}.stemsPerBouquet`, flower.stemsPerBouquet);
    }
  }

  async function onSubmit(values: PurchaseSchemaValues) {
    setSubmitError(null);
    try {
      const created = await createPurchase(values);
      toast.success(`Compra ${created.purchaseNumber} registrada correctamente`);
      window.location.href = `/purchases/${created.id}`;
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  if (isLoadingOptions) return <LoadingSpinner label="Cargando fincas y variedades..." />;

  const farmOptions = farms.map((farm) => ({ value: farm.id, label: `${farm.code} · ${farm.name}` }));
  const flowerOptions = flowers.map((flower) => ({
    value: flower.id,
    label: `${flower.flowerType} ${flower.variety} ${flower.stemLength}cm`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Datos de la compra</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Fecha" type="date" required error={errors.purchaseDate?.message} {...register('purchaseDate')} />
          <Select
            label="Finca"
            required
            placeholder="Selecciona una finca"
            options={farmOptions}
            error={errors.farmId?.message}
            {...register('farmId')}
          />
          <Input label="Responsable" required error={errors.responsible?.message} {...register('responsible')} />
          <Input label="Observación" error={errors.observation?.message} {...register('observation')} />
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Detalle de flores</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => append({ flowerId: 0, quantityBouquets: 1, stemsPerBouquet: 25, unitPrice: 0 })}
          >
            Agregar línea
          </Button>
        </div>

        {errors.details?.root && <p className="mb-2 text-sm text-red-600">{errors.details.root.message}</p>}
        {typeof errors.details?.message === 'string' && <p className="mb-2 text-sm text-red-600">{errors.details.message}</p>}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-xl border border-primary-100 p-3 dark:border-primary-900/40 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <Select
                  label={index === 0 ? 'Flor' : undefined}
                  placeholder="Selecciona una flor"
                  options={flowerOptions}
                  error={errors.details?.[index]?.flowerId?.message}
                  {...register(`details.${index}.flowerId`, {
                    onChange: (event) => handleFlowerChange(index, Number(event.target.value)),
                  })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={index === 0 ? 'Ramos' : undefined}
                  type="number"
                  min={1}
                  error={errors.details?.[index]?.quantityBouquets?.message}
                  {...register(`details.${index}.quantityBouquets`)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label={index === 0 ? 'Tallos/ramo' : undefined}
                  type="number"
                  readOnly
                  tabIndex={-1}
                  className="cursor-not-allowed bg-primary-50/60 dark:bg-primary-900/20"
                  hint={index === 0 ? 'Automático, según la flor' : undefined}
                  error={errors.details?.[index]?.stemsPerBouquet?.message}
                  {...register(`details.${index}.stemsPerBouquet`)}
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
              <div className="flex items-end justify-between gap-2 sm:col-span-2">
                <div className="text-xs text-gray-500 dark:text-primary-400">
                  <p>{rowsWithTotals[index]?.totalStems ?? 0} tallos</p>
                  <p className="font-semibold text-primary-700 dark:text-primary-200">
                    {formatCurrency(rowsWithTotals[index]?.subtotal ?? 0)}
                  </p>
                </div>
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
            <p className="text-xs text-gray-500 dark:text-primary-400">Total de la compra</p>
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
          Registrar compra
        </Button>
      </div>
    </form>
  );
}
