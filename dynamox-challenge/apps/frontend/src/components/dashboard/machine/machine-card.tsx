import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Engine as EngineIcon, ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import type { Machine } from '@/types/machine';
import { paths } from '@/paths';

export interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const monitoringPointsCount = machine.monitoringPoints?.length || 0;

  return (
    <Grid size={{ md: 4, sm: 6, xs: 12 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
                {machine.name}
              </Typography>
              <Chip
                label={machine.type}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Divider />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%)',
                  height: '72px',
                  width: '72px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <EngineIcon size={40} weight="duotone" />
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Monitoring Points
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {monitoringPointsCount}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 0, mt: 'auto' }}>
          <Button
            fullWidth
            size="large"
            endIcon={<ArrowRightIcon />}
            onClick={() => navigate(paths.machine.detail(machine.id))}
            sx={{
              py: 1.5,
              borderRadius: 0,
              fontWeight: 600,
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
