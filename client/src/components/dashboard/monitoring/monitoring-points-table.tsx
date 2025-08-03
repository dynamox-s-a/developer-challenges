'use client';

import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import { useState } from 'react';

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  return [...array].sort(comparator);
}

export interface MonitoringPoint {
  id: string;
  name: string;
  sensorType: string;
  sensorId: string;
  machineId: string;
  machineName: string;
  machineType: string;
}

interface MonitoringPointsTableProps {
  monitoringPoints: MonitoringPoint[];
  orderBy: keyof MonitoringPoint;
  order: Order;
  onSort: (property: keyof MonitoringPoint) => void;
}

export function MonitoringPointsTable({ 
  monitoringPoints, 
  orderBy, 
  order, 
  onSort 
}: MonitoringPointsTableProps): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const sorted = stableSort(monitoringPoints, getComparator(order, orderBy));
  
  // Apply pagination
  const paginatedData = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { key: 'machineName' as keyof MonitoringPoint, label: 'Machine Name' },
    { key: 'machineType' as keyof MonitoringPoint, label: 'Machine Type' },
    { key: 'name' as keyof MonitoringPoint, label: 'Monitoring Point Name' },
    { key: 'sensorType' as keyof MonitoringPoint, label: 'Sensor Type' },
  ];

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : 'asc'}
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.machineName}</TableCell>
                <TableCell>{point.machineType}</TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.sensorType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sorted.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
} 