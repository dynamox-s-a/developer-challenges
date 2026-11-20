import { Typography } from '@mui/material';
import { MACHINE_TYPES } from '@dynapredict/shared';

export function MachinesPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Máquinas
      </Typography>
      <Typography color="text.secondary">
        Em breve: cadastro de máquinas. Tipos aceitos:{' '}
        {MACHINE_TYPES.join(', ')}.
      </Typography>
    </>
  );
}
