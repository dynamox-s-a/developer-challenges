'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';


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

const machines = [
  { id: 'USR-010', name: 'Pump Alpha Romeo', type: 'pump', monitoringPoints: [] },
  {
    id: 'USR-009',
    name: 'Cooling Beta',
    type: 'fan',
    monitoringPoints: [
      { id: 'USR-009-001', monitoringPointName: 'Temperature', sensorType: 'TcAg', machineName: 'USR-009' },
      { id: 'USR-009-002', monitoringPointName: 'Humidity', sensorType: 'TcAS', machineName: 'USR-009' },
      { id: 'USR-009-003', monitoringPointName: 'Pressure', sensorType: 'HF+', machineName: 'USR-009' },
    ],
  },
  {
    id: 'USR-008',
    name: 'Industrial Gamma',
    type: 'pump',
    monitoringPoints: [
      { id: 'USR-008-004', monitoringPointName: 'Temperature', sensorType: 'TcAg', machineName: 'USR-008' },
      { id: 'USR-008-005', monitoringPointName: 'Humidity', sensorType: 'TcAS', machineName: 'USR-008' },
      { id: 'USR-008-006', monitoringPointName: 'Pressure', sensorType: 'HF+', machineName: 'USR-008' },
      { id: 'USR-008-007', monitoringPointName: 'Level', sensorType: 'HF+', machineName: 'USR-008' },
      { id: 'USR-008-008', monitoringPointName: 'Flow', sensorType: 'HF+', machineName: 'USR-008' },
    ],
  },
];

type MonitoringPoint = {
  id: string;
  monitoringPointName: string;
  sensorType: string;
  machineName: string;
};

export default function Page(): React.JSX.Element {
  const [orderBy, setOrderBy] = React.useState<keyof MonitoringPoint>('id');
  const [order, setOrder] = React.useState<Order>('asc');

  const monitoringPoints = machines.flatMap((m) => m.monitoringPoints);

  const sorted = stableSort(monitoringPoints, getComparator(order, orderBy));

  const handleSort = (property: keyof MonitoringPoint) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring Points</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Add
          </Button>
        </div>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {(['id', 'monitoringPointName', 'sensorType', 'machineName'] as (keyof MonitoringPoint)[]).map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : 'asc'}
                    onClick={() => handleSort(key)}
                  >
                    {({
                      id: 'ID',
                      monitoringPointName: 'Monitoring Point Name', 
                      sensorType: 'Sensor Type',
                      machineName: 'Machine Name'
                    }[key] || key)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.id}</TableCell>
                <TableCell>{point.monitoringPointName}</TableCell>
                <TableCell>{point.sensorType}</TableCell>
                <TableCell>{point.machineName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
