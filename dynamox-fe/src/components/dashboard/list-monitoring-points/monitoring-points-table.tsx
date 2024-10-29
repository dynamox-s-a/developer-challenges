'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel } from '@mui/material';


function noop(): void {
  // do nothing
}

export interface MonitoringPoints {
  uuid: string;
  name: string;
  machine: { uuid: string; name:string; type: string };
  sensor: { uuid: string; modelName: string};
}

interface MonitoringPointsTableProps {
  count?: number;
  page?: number;
  rows?: MonitoringPoints[];
  rowsPerPage?: number;
}

type Order = 'asc' | 'desc';

export function MonitoringPointsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: MonitoringPointsTableProps): React.JSX.Element {

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('name');

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...rows].sort((a, b) => {
      const valueA = orderBy === 'machineName' ? a.machine.name 
                      : orderBy === 'machineType' ? a.machine.type 
                      : orderBy === 'sensorModel' ? a.sensor.modelName 
                      : a[orderBy as keyof MonitoringPoints];
      
      const valueB = orderBy === 'machineName' ? b.machine.name 
                      : orderBy === 'machineType' ? b.machine.type 
                      : orderBy === 'sensorModel' ? b.sensor.modelName 
                      : b[orderBy as keyof MonitoringPoints];

      if (order === 'asc') {
        return valueA < valueB ? -1 : 1;
      }
      return valueA > valueB ? -1 : 1;
    });
  }, [rows, order, orderBy]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
          <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'machine'}
                  direction={orderBy === 'machine' ? order : 'asc'}
                  onClick={() => handleRequestSort('machineName')}
                >
                  Machine Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'machineType'}
                  direction={orderBy === 'machineType' ? order : 'asc'}
                  onClick={() => handleRequestSort('machineType')}
                >
                  Machine Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Monitoring Point Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'sensorModel'}
                  direction={orderBy === 'sensorModel' ? order : 'asc'}
                  onClick={() => handleRequestSort('sensorModel')}
                >
                  Sensor Model
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {sortedRows.map((row) => (
              <TableRow key={row.uuid}>
                <TableCell>{row.machine.name}</TableCell>
                <TableCell>{row.machine.type}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.sensor.modelName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </Card>
  );
}
