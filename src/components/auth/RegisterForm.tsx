import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { registerSchema, type RegisterSchemaValues } from '@/schemas/registerSchema';
import { registerUser } from '@/services/registerService';
import { getErrorMessage } from '@/utils/errors';

export function RegisterForm() {
  const [registered, setRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', firstName: '', lastName: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: RegisterSchemaValues) {
    try {
      await registerUser(values);
      setRegistered(true);
      toast.success('Cuenta creada correctamente');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (registered) {
    return (
      <div className="w-full max-w-md">
        <div className="card space-y-4 p-6 text-center sm:p-8">
          <p className="text-sm text-gray-700 dark:text-primary-200">
            Tu cuenta se creó correctamente con rol <strong>Operador</strong>. Ya puedes iniciar sesión.
          </p>
          <Button fullWidth size="lg" onClick={() => (window.location.href = '/login')}>
            Ir a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-6 sm:p-8">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Nombres" required error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Apellidos" required error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input
          label="Contraseña"
          type="password"
          required
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting} size="lg" leftIcon={<UserPlus className="h-4 w-4" />}>
          Crear cuenta
        </Button>

        <p className="text-center text-xs text-gray-500 dark:text-primary-400/80">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="font-medium text-primary-700 hover:underline dark:text-primary-300">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
