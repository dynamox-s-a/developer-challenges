import Link from 'next/link';
import { Avatar, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Wrench } from '@phosphor-icons/react/dist/ssr/Wrench';

import { paths } from '@/paths';

type TotalMachinesProps = {
  machinesCount: number;
};

export function TotalMachines({ machinesCount = 0 }: TotalMachinesProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Current machines registered:
              </Typography>
              <Typography variant="h4">{machinesCount}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <Wrench fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          LinkComponent={Link}
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          href={paths.dashboard.machines}
        >
          Manage them
        </Button>
      </CardActions>
    </Card>
  );
}
