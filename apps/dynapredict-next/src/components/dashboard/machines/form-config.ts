import { z as zod } from 'zod';

export const machineTypes = ['Pump', 'Fan'] as const;

export const machineFormFields = [
  {
    name: 'name',
    label: 'Machine Name',
    type: 'text' as const,
  },
  {
    name: 'type',
    label: 'Machine Type',
    type: 'select' as const,
    options: machineTypes.map((type) => ({ value: type, label: type })),
  },
];

export const schema = zod.object({
  name: zod.string().min(1, { message: 'Machine name is required' }),
  type: zod.enum(machineTypes),
});

export type MachineFormValues = zod.infer<typeof schema>;

export const defaultValues: MachineFormValues = {
  name: '',
  type: 'Pump',
};
