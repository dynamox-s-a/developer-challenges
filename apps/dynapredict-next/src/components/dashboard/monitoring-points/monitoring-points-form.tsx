'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Machine } from '@/types/data-types';
import { useAddMonitoringPointMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';
import type { IFormField } from '@/components/dashboard/form/form-component';
import { GenericForm } from '@/components/dashboard/form/form-component';

const schema = zod.object({
  name: zod.string().min(1, { message: 'Monitoring point name is required' }),
  machineId: zod.string().min(1, { message: 'Machine selection is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  name: '',
  machineId: '',
} satisfies Values;

type MonitoringPointsFormProps = {
  machines: Machine[];
};

export function MonitoringPointsForm({ machines }: MonitoringPointsFormProps): React.JSX.Element {
  const [addMonitoringPoint, { isLoading }] = useAddMonitoringPointMutation();
  const { checkSession } = useUser();

  const form = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const fields: IFormField[] = [
    {
      name: 'name',
      label: 'Monitoring Point Name',
      type: 'text',
    },
    {
      name: 'machineId',
      label: 'Machine',
      type: 'select',
      options: machines.map((machine) => ({
        value: machine.id.toString(),
        label: machine.name,
      })),
    },
  ];

  const handleFormSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        await checkSession?.();
        await addMonitoringPoint({
          name: values.name,
          machineId: parseInt(values.machineId, 10),
        }).unwrap();
      } catch (error) {
        const apiError = error as { data?: { message?: string }; status?: number };
        const errorMessage = apiError.data?.message || 'Something went wrong';

        form.setError('root', {
          type: 'server',
          message: errorMessage,
        });
      }
    },
    [form, addMonitoringPoint]
  );

  return (
    <GenericForm
      form={form}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      title="Add new monitoring point"
      description="Fill in the details to add a new monitoring point"
      submitText="Add monitoring point"
      fields={fields}
      cardProps={{ sx: { height: '100%' } }}
    />
  );
}
