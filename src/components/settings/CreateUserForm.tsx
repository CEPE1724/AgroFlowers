import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { adminUserSchema, type AdminUserSchemaValues } from '@/schemas/adminUserSchema';
import { createUserByAdmin } from '@/services/adminUserService';
import { getErrorMessage } from '@/utils/errors';

const ROLE_OPTIONS = [
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'ADMIN', label: 'Administrador' },
];

export function CreateUserForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserSchemaValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'SUPERVISOR',
    },
  });

  async function onSubmit(values: AdminUserSchemaValues) {
    try {
      await createUserByAdmin(values);
      toast.success(`Usuario "${values.username}" creado correctamente`);
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Usuario"
          required
          error={errors.username?.message}
          {...register('username')}
          placeholder="jperez"
        />
        <Input
          label="Correo electrónico"
          type="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input label="Nombres" required error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Apellidos" required error={errors.lastName?.message} {...register('lastName')} />
        <Input
          label="Contraseña"
          type="password"
          required
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Select
          label="Rol"
          required
          options={ROLE_OPTIONS}
          error={errors.role?.message}
          {...register('role')}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-primary-400/70">
        Los usuarios con rol Operador se crean desde el formulario público de registro. Aquí solo se crean
        cuentas de Supervisor y Administrador.
      </p>

      <div className="flex justify-end">
        <Button type="submit" leftIcon={<UserPlus className="h-4 w-4" />} isLoading={isSubmitting}>
          Crear usuario
        </Button>
      </div>
    </form>
  );
}
