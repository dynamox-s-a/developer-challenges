import type { Machine, MachineStatus } from '@repo/contracts';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { IconifyName } from 'src/components/iconify';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

const STATUS_LABELS: Record<MachineStatus, { text: string; color: 'success' | 'warning' | 'error' | 'default' }> =
  {
    operational: { text: 'Operando', color: 'success' },
    alert: { text: 'Em alerta', color: 'warning' },
    critical: { text: 'Crítico', color: 'error' },
    stopped: { text: 'Parada', color: 'default' },
  };

const formatDateTime = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR');
};

type Props = { machine: Machine };

export function MachineHeader({ machine }: Props) {
  const status = STATUS_LABELS[machine.status];

  const details: { icon: IconifyName; label: string; value: string }[] = [
    { icon: 'solar:settings-bold', label: 'Tipo', value: machine.type },
    { icon: 'solar:case-minimalistic-bold', label: 'Fabricante', value: machine.manufacturer },
    { icon: 'solar:restart-bold', label: 'Rotação', value: `${machine.rpm} RPM` },
    {
      icon: 'solar:ssd-round-bold',
      label: 'Sensor',
      value: `${machine.sensor.model} · ${machine.sensor.serialNumber}`,
    },
    { icon: 'mingcute:location-fill', label: 'Posição', value: machine.sensor.position },
    {
      icon: 'solar:clock-circle-bold',
      label: 'Última leitura',
      value: formatDateTime(machine.lastReadingAt),
    },
  ];

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, mb: 3 }}
      >
        <Avatar
          sx={{ width: 56, height: 56, bgcolor: 'primary.lighter', color: 'primary.dark' }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={28} />
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" noWrap>
            {machine.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {machine.id} · {machine.sensor.position}
          </Typography>
        </Box>

        <Label color={status.color} variant="soft" sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          {status.text}
        </Label>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {details.map((detail) => (
          <Stack key={detail.label} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Iconify icon={detail.icon} width={22} sx={{ color: 'text.disabled', flexShrink: 0 }} />

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {detail.label}
              </Typography>
              <Typography variant="subtitle2" noWrap title={detail.value}>
                {detail.value}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Card>
  );
}
