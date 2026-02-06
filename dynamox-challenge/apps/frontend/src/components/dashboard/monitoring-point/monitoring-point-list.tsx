import * as React from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { PencilSimple as PencilIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MonitoringPoint } from '@/types/monitoring-point';

interface MonitoringPointsListProps {
  monitoringPoints: MonitoringPoint[];
  total?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  showMachineColumn?: boolean;
  onEdit: (mp: MonitoringPoint) => void;
  onDelete: (mp: MonitoringPoint) => void;
  onViewSensor?: (mp: MonitoringPoint) => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function MonitoringPointsList({
  monitoringPoints,
  total = 0,
  page = 0,
  limit = 5,
  sortBy = 'id',
  sortOrder = 'asc',
  showMachineColumn = false,
  onEdit,
  onDelete,
  onViewSensor,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}: MonitoringPointsListProps): React.JSX.Element {

  const handleRequestSort = (property: string) => {
    if (onSortChange) {
      const isAsc = sortBy === property && sortOrder === 'asc';
      onSortChange(property, isAsc ? 'desc' : 'asc');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage + 1); // Backend uses 1-based indexing
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(parseInt(event.target.value, 10));
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {showMachineColumn && (
                <>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'machineName'}
                      direction={sortBy === 'machineName' ? sortOrder : 'asc'}
                      onClick={() => handleRequestSort('machineName')}
                    >
                      Machine Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'machineType'}
                      direction={sortBy === 'machineType' ? sortOrder : 'asc'}
                      onClick={() => handleRequestSort('machineType')}
                    >
                      Machine Type
                    </TableSortLabel>
                  </TableCell>
                </>
              )}
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'monitoringPointName'}
                  direction={sortBy === 'monitoringPointName' ? sortOrder : 'asc'}
                  onClick={() => handleRequestSort('monitoringPointName')}
                >
                  Monitoring Point Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Sensors</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoringPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showMachineColumn ? 5 : 4} align="center">
                  <Typography color="text.secondary">No monitoring points found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              monitoringPoints.map((mp) => (
                <TableRow key={mp.id} hover>
                  {showMachineColumn && (
                    <>
                      <TableCell>{mp.machine?.name || 'N/A'}</TableCell>
                      <TableCell>{mp.machine?.type || 'N/A'}</TableCell>
                    </>
                  )}
                  <TableCell>{mp.name}</TableCell>
                  <TableCell>
                    {onViewSensor ? (
                      <Button variant="text" onClick={() => onViewSensor(mp)}>
                        View Sensors ({mp._count?.sensors || mp.sensors?.length || 0})
                      </Button>
                    ) : (
                      <Typography>{mp._count?.sensors || mp.sensors?.length || 0}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => onEdit(mp)}>
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
      {onPageChange && onRowsPerPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page - 1} // TablePagination uses 0-based indexing
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </Card>
  );
}
