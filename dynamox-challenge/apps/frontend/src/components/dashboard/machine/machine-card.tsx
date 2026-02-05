import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { EngineIcon } from '@phosphor-icons/react/dist/ssr/Engine';

import type { Machine } from '@/types/machine';

export interface MachineCardProps {
  machine: Machine;
  onEdit: () => void;
  onDelete: () => void;
}

export function MachineCard({ machine, onEdit, onDelete }: MachineCardProps): React.JSX.Element {
  return (
    <Grid size={{ md: 4, sm: 6, xs: 12 }}>
      <Card sx={{ minWidth: 250 }}>
        <CardHeader title={machine.name} />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'var(--mui-palette-background-paper)',
                  boxShadow: 'var(--mui-shadows-1)',
                  color: 'var(--mui-palette-text-primary)',
                  height: '80px',
                  width: '80px'
                }}
              >
                <EngineIcon fontSize="var(--icon-fontSize-lg)" size={75} />
              </Avatar>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {machine.type}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {machine.status}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button size="small" onClick={onEdit}>Edit</Button>
          <Button size="small" onClick={onDelete} color="error">Delete</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
