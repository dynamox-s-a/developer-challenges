'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import { MonitoringPoint, PaginatedMonitoringPoints } from '@/types/data-types';
import { useGetPaginatedMonitoringPointsQuery } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';

type SortColumn = 'machine_name' | 'machine_type' | 'monitoring_point_name' | 'sensor_model';
type SortOrder = 'asc' | 'desc';

interface Column {
  id: SortColumn;
  label: string;
}

const columns: Column[] = [
  { id: 'machine_name', label: 'Machine Name' },
  { id: 'machine_type', label: 'Machine Type' },
  { id: 'monitoring_point_name', label: 'Monitoring Point Name' },
  { id: 'sensor_model', label: 'Sensor Model' },
];

const typeMap = {
  Pump: { color: 'primary' },
  Fan: { color: 'secondary' },
} as const;

export function MonitoringPointsTable(): React.JSX.Element {
  const [sortBy, setSortBy] = useState<SortColumn>('machine_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useGetPaginatedMonitoringPointsQuery({
    page: page + 1,
    sortBy,
    sortOrder,
  });

  if (isLoading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSort = (column: SortColumn) => {
    const newSortOrder: SortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {isFetching && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortBy === column.id ? sortOrder : 'asc'}
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((point: MonitoringPoint) => {
            const { color } = typeMap[point.machine.type] ?? { color: 'default' };

            return (
              <TableRow hover key={point.id}>
                <TableCell>{point.machine.name}</TableCell>
                <TableCell>
                  <Chip color={color} label={point.machine.type} size="small" />
                </TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.sensor?.model || 'No sensor'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}
