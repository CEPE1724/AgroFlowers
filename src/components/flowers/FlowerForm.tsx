import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { flowerSchema, type FlowerSchemaValues } from '@/schemas/flowerSchema';
import { createFlower, updateFlower } from '@/services/flowerService';
import { getErrorMessage } from '@/utils/errors';
import type { Flower } from '@/types/flower';

interface FlowerFormProps {
  flower?: Flower;
}

const UNIT_OPTIONS = [
  { value: 'RAMO', label: 'Ramo' },
  { value: 'TALLO', label: 'Tallo' },
  { value: 'CAJA', label: 'Caja' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
];

export function FlowerForm({ flower }: FlowerFormProps) {
  const isEditing = Boolean(flower);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlowerSchemaValues>({
    resolver: zodResolver(flowerSchema),
    defaultValues: flower
      ? {
          flowerType: flower.flowerType,
          variety: flower.variety,
          color: flower.color,
          stemLength: flower.stemLength,
          stemsPerBouquet: flower.stemsPerBouquet,
          purchaseUnit: flower.purchaseUnit,
          status: flower.status,
        }
      : {
          flowerType: '',
          variety: '',
          color: '',
          stemLength: 50,
          stemsPerBouquet: 25,
          purchaseUnit: 'RAMO',
          status: 'ACTIVE',
        },
  });

  async function onSubmit(values: FlowerSchemaValues) {
    setSubmitError(null);
    try {
      if (isEditing && flower) {
        await updateFlower(flower.id, values);
        toast.success('Variedad actualizada correctamente');
      } else {
        await createFlower(values);
        toast.success('Variedad registrada correctamente');
      }
      window.location.href = '/flowers';
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-5">
      {isEditing && flower && (
        <p className="text-xs text-gray-500 dark:text-primary-400/70">
          Código: <span className="font-mono font-medium text-primary-700 dark:text-primary-200">{flower.code}</span>
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Tipo de flor" required error={errors.flowerType?.message} {...register('flowerType')} placeholder="Rosa" />
        <Input label="Variedad" required error={errors.variety?.message} {...register('variety')} placeholder="Freedom" />
        <Input label="Color" required error={errors.color?.message} {...register('color')} />
        <Input
          label="Longitud del tallo (cm)"
          type="number"
          min={1}
          required
          error={errors.stemLength?.message}
          {...register('stemLength')}
        />
        <Input
          label="Tallos por ramo"
          type="number"
          min={1}
          required
          error={errors.stemsPerBouquet?.message}
          {...register('stemsPerBouquet')}
        />
        <Select label="Unidad de compra" required options={UNIT_OPTIONS} error={errors.purchaseUnit?.message} {...register('purchaseUnit')} />
        <Select label="Estado" required options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" leftIcon={<Save className="h-4 w-4" />} isLoading={isSubmitting}>
          {isEditing ? 'Guardar cambios' : 'Registrar variedad'}
        </Button>
      </div>
    </form>
  );
}
