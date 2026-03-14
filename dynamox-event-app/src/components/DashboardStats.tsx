'use client';

import {
  Typography,
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

import { ReactNode } from 'react';

type DashboardStatsProps = {
  icon: ReactNode
  value: number | string
  label: string
}

export default function DashboardStats({
  icon,
  value,
  label
}: DashboardStatsProps) {

  return (
    <Grid size={{ xs: 12, sm: 4 }}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            {icon}
            <Box>
              <Typography variant="h5">
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}