'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectMonitoringPoints,
  Order,
} from '@/store/monitoring/monitoring.selectors';
import { RootState } from '@/store/indext';

const columns = [
  { id: 'machineName', label: 'Máquina' },
  { id: 'machineType', label: 'Tipo da Máquina' },
  { id: 'name', label: 'Ponto de Monitoramento' },
  { id: 'sensor', label: 'Modelo do Sensor' },
] as const;

type ColumnId = (typeof columns)[number]['id'];

export function MonitoringTable() {
  const [orderBy, setOrderBy] = useState<ColumnId>('machineName');
  const [order, setOrder] = useState<Order>('asc');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const points = useSelector((state: RootState) =>
    selectMonitoringPoints(state, orderBy, order, page, rowsPerPage)
  );

  const total = useSelector(
    (state: RootState) => state.monitoring.items.length
  );

  const handleSort = (property: ColumnId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id}>
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => handleSort(col.id)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {points.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.machineName}</TableCell>
              <TableCell>{point.machineType}</TableCell>
              <TableCell>{point.name}</TableCell>
              <TableCell>{point.sensor.model}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[5]}
      />
    </>
  );
}
