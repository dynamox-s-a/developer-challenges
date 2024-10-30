import Link from 'next/link';
import { Avatar, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { SecurityCamera } from '@phosphor-icons/react/dist/ssr/SecurityCamera';

import { paths } from '@/paths';

type TotalMonitoringPointsProps = {
  mpsCount: number;
};

export function TotalMonitoringPoints({ mpsCount }: TotalMonitoringPointsProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Current monitoring points registered:
              </Typography>
              <Typography variant="h4">{mpsCount}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <SecurityCamera fontSize="var(--icon-fontSize-lg)" />
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
          href={paths.dashboard.monitoring_points}
        >
          Manage them
        </Button>
      </CardActions>
    </Card>
  );
}
