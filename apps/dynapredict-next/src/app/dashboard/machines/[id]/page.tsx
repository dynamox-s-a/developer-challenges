import { notFound } from 'next/navigation';
import Grid from '@mui/material/Unstable_Grid2';

import { EditForm } from '@/components/dashboard/machines/edit-form';

export default function Page({ params }: { params: { id: string } }): React.JSX.Element {
  const machineTypes = ['Pump', 'Fan'];

  const mockMachine = {
    id: '1',
    name: 'Pump A1',
    type: 'Pump' as const,
    createdAt: new Date(),
  };

  if (params.id !== mockMachine.id) {
    notFound();
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={6} sm={6} xs={12}>
        <EditForm machine={mockMachine} types={machineTypes} />
      </Grid>
    </Grid>
  );
}
