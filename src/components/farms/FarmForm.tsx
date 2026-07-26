import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { farmSchema, type FarmSchemaValues } from '@/schemas/farmSchema';
import { createFarm, updateFarm } from '@/services/farmService';
import { getErrorMessage } from '@/utils/errors';
import type { Farm } from '@/types/farm';

interface FarmFormProps {
  farm?: Farm;
}

const RATING_OPTIONS = [
  { value: 'EXCELENTE', label: 'Excelente' },
  { value: 'BUENA', label: 'Buena' },
  { value: 'REGULAR', label: 'Regular' },
  { value: 'MALA', label: 'Mala' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
];

export function FarmForm({ farm }: FarmFormProps) {
  const isEditing = Boolean(farm);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FarmSchemaValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: farm
      ? {
          code: farm.code,
          name: farm.name,
          ruc: farm.ruc,
          contactName: farm.contactName,
          phone: farm.phone,
          email: farm.email,
          city: farm.city,
          province: farm.province,
          address: farm.address ?? '',
          creditDays: farm.creditDays,
          rating: farm.rating,
          status: farm.status,
          observation: farm.observation ?? '',
        }
      : {
          code: '',
          name: '',
          ruc: '',
          contactName: '',
          phone: '',
          email: '',
          city: '',
          province: '',
          address: '',
          creditDays: 0,
          rating: 'BUENA',
          status: 'ACTIVE',
          observation: '',
        },
  });

  async function onSubmit(values: FarmSchemaValues) {
    setSubmitError(null);
    try {
      if (isEditing && farm) {
        await updateFarm(farm.id, values);
        toast.success('Finca actualizada correctamente');
        window.location.href = `/farms/${farm.id}`;
      } else {
        const created = await createFarm(values);
        toast.success('Finca registrada correctamente');
        window.location.href = `/farms/${created.id}`;
      }
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Datos generales</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Código" required error={errors.code?.message} {...register('code')} placeholder="FIN-004" />
          <Input label="Nombre de finca" required error={errors.name?.message} {...register('name')} />
          <Input label="RUC" required error={errors.ruc?.message} {...register('ruc')} placeholder="13 dígitos" maxLength={13} />
          <Input label="Persona de contacto" required error={errors.contactName?.message} {...register('contactName')} />
          <Input label="Teléfono" required error={errors.phone?.message} {...register('phone')} placeholder="10 dígitos" maxLength={10} />
          <Input label="Correo electrónico" type="email" required error={errors.email?.message} {...register('email')} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Ubicación</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Ciudad" required error={errors.city?.message} {...register('city')} />
          <Input label="Provincia" required error={errors.province?.message} {...register('province')} />
          <Input label="Dirección" error={errors.address?.message} {...register('address')} />
        </div>
      </div>

      <div className="card space-y-4 p-5">
        <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-50">Condiciones comerciales</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Días de crédito"
            type="number"
            min={0}
            required
            error={errors.creditDays?.message}
            {...register('creditDays')}
          />
          <Select label="Calificación" required options={RATING_OPTIONS} error={errors.rating?.message} {...register('rating')} />
          <Select label="Estado" required options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
        </div>
        <div>
          <label className="label-base" htmlFor="observation">
            Observación
          </label>
          <textarea id="observation" rows={3} className="input-base" {...register('observation')} />
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
          {isEditing ? 'Guardar cambios' : 'Registrar finca'}
        </Button>
      </div>
    </form>
  );
}
