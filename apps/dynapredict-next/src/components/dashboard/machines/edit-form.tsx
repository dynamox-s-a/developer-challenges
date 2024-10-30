'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Machine } from '@/types/data-types';
import { useUpdateMachineMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';
import { GenericForm } from '@/components/dashboard/form/form-component';

import { machineFormFields, MachineFormValues, schema } from './form-config';

type EditFormProps = {
  machine: Machine;
};

export function EditForm({ machine }: EditFormProps): React.JSX.Element {
  const [updateMachine, { isLoading }] = useUpdateMachineMutation();
  const { checkSession } = useUser();
  const router = useRouter();

  const form = useForm<MachineFormValues>({
    defaultValues: {
      name: machine.name,
      type: machine.type,
    },
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = React.useCallback(
    async (values: MachineFormValues): Promise<void> => {
      try {
        await checkSession?.();
        await updateMachine({ id: machine.id, ...values });
        router.push('/dashboard/machines');
      } catch (error) {
        form.setError('root', {
          type: 'server',
          message: error instanceof Error ? error.message : 'Something went wrong',
        });
      }
    },
    [checkSession, machine.id, updateMachine, router, form]
  );

  return (
    <GenericForm
      form={form}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      title="Edit Machine"
      description="Update the machine details"
      submitText="Update Machine"
      fields={machineFormFields}
      cardProps={{ sx: { height: '100%' } }}
    />
  );
}
