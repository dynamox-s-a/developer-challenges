import * as React from 'react';
import {
  Box,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PencilSimple as PencilIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MonitoringPoint } from '@/types/monitoring-point';

interface MonitoringPointsListProps {
  monitoringPoints: MonitoringPoint[];
  showMachineColumn?: boolean;
  onEdit: (mp: MonitoringPoint) => void;
  onDelete: (mp: MonitoringPoint) => void;
}

export function MonitoringPointsList({
  monitoringPoints,
  showMachineColumn = false,
  onEdit,
  onDelete,
}: MonitoringPointsListProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              {showMachineColumn && <TableCell>Machine</TableCell>}
              <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoringPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showMachineColumn ? 4 : 3} align="center">
                  <Typography color="text.secondary">No monitoring points found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              monitoringPoints.map((mp) => (
                <TableRow hover key={mp.id}>
                  <TableCell>{mp.id}</TableCell>
                  <TableCell>{mp.name}</TableCell>
                  {showMachineColumn && <TableCell>{mp.machine?.name || '-'}</TableCell>}
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => onEdit(mp)} color="primary">
                        <PencilIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete(mp)} color="error">
                        <TrashIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
