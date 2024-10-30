'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAddMachineMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';
import { GenericForm } from '@/components/dashboard/form/form-component';

import { defaultValues, machineFormFields, MachineFormValues, schema } from './form-config';

type MachinesFormProps = {
  isFormDisabled: boolean;
};

export function MachinesForm({ isFormDisabled }: MachinesFormProps): React.JSX.Element {
  const [addMachine, { isLoading }] = useAddMachineMutation();
  const { checkSession } = useUser();

  const form = useForm<MachineFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = React.useCallback(
    async (values: MachineFormValues): Promise<void> => {
      try {
        await checkSession?.();
        await addMachine(values).unwrap();
      } catch (error) {
        const apiError = error as { data?: { message?: string }; status?: number };
        const errorMessage = apiError.data?.message || 'Something went wrong';

        form.setError('root', {
          type: 'server',
          message: errorMessage,
        });
      }
    },
    [addMachine, checkSession, form]
  );

  return (
    <GenericForm
      form={form}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      title="Add new machine"
      description="Fill in the details to add a new machine to your inventory"
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
