'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { usePostMachineMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';
import { GenericForm } from '@/components/dashboard/form/form-component';

import { defaultValues, machineFormFields, MachineFormValues, schema } from './form-config';

interface MachinesFormProps {
  isFormDisabled: boolean;
}

export function MachinesForm({ isFormDisabled }: MachinesFormProps): React.JSX.Element {
  const [registerMachine, { isLoading }] = usePostMachineMutation();
  const { checkSession, user } = useUser();

  const form = useForm<MachineFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = React.useCallback(
    async (values: MachineFormValues): Promise<void> => {
      try {
        await checkSession?.();
        await registerMachine({...values, userId: Number(user?.id) }).unwrap();
      } catch (error) {
        const apiError = error as { data?: { message?: string }; status?: number };
        const errorMessage = apiError.data?.message || 'Something went wrong';

        form.setError('root', {
          type: 'server',
          message: errorMessage,
        });
      }
    },
    [registerMachine, checkSession, form]
  );

  return (
    <GenericForm
      form={form}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      title="Register new machine"
      description="Add a new machine to start monitoring."
      submitText="Add machine"
      fields={machineFormFields}
      cardProps={{
        sx: {
          height: '100%',
          opacity: isFormDisabled ? 0.5 : 1,
          pointerEvents: isFormDisabled ? 'none' : 'auto',
        },
      }}
    />
  );
}
