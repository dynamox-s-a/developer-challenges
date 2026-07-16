import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { machineSelected } from 'src/store/machines/slice';
import { PERIOD_LABELS, PERIODS, type Period } from 'src/store/measurements/period';
import { periodChanged } from 'src/store/measurements/slice';

export function DataToolbar() {
  const dispatch = useAppDispatch();

  const machines = useAppSelector((state) => state.machines.items);
  const selectedId = useAppSelector((state) => state.machines.selectedId);
  const period = useAppSelector((state) => state.measurements.period);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
    >
      <TextField
        select
        size="small"
        label="Máquina"
        value={selectedId ?? ''}
        onChange={(event) => dispatch(machineSelected(event.target.value))}
        sx={{ minWidth: 260 }}
        slotProps={{ htmlInput: { 'aria-label': 'Selecionar máquina' } }}
      >
        {machines.map((machine) => (
          <MenuItem key={machine.id} value={machine.id}>
            {machine.name}
          </MenuItem>
        ))}
      </TextField>

      <ToggleButtonGroup
        exclusive
        size="small"
        value={period}
        aria-label="Período exibido"
        onChange={(_event, value: Period | null) => value && dispatch(periodChanged(value))}
      >
        {PERIODS.map((item) => (
          <ToggleButton key={item} value={item}>
            {PERIOD_LABELS[item]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
