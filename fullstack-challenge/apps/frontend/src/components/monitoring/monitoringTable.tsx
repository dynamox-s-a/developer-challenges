/**
 * Tabela responsável por exibir os pontos de monitoramento cadastrados.
 *
 * Os dados são obtidos a partir do estado global do Redux,
 * enquanto ordenação e paginação são controladas por estado local
 * e aplicadas através de selectors.
 */

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { getComparator, Order, stableSort } from './monitoringTableSort';

interface TableRowData {
  machineName: string;
  machineType: string;
  monitoringPointName: string;
  sensorModel: string;
}

type HeadCell = {
  id: keyof TableRowData;
  label: string;
};

const headCells: HeadCell[] = [
  { id: 'machineName', label: 'Máquina' },
  { id: 'machineType', label: 'Tipo da Máquina' },
  { id: 'monitoringPointName', label: 'Ponto de Monitoramento' },
  { id: 'sensorModel', label: 'Modelo do Sensor' },
];

export function MonitoringTable() {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TableRowData>('machineName');
  const [page, setPage] = useState(0);

  const rowsPerPage = 5;

  const machines = useSelector((state: RootState) => state.machines);
  const monitoringPoints = useSelector(
    (state: RootState) => state.monitoring.items
  );

  const rows = useMemo<TableRowData[]>(() => {
    return monitoringPoints
      .map((mp) => {
        const machine = machines.entities[mp.machineId];
        if (!machine) return null;

        return {
          machineName: machine.name,
          machineType: machine.type,
          monitoringPointName: mp.name,
          sensorModel: mp.sensor.model,
        };
      })
      .filter(Boolean) as TableRowData[];
  }, [machines, monitoringPoints]);

  const handleRequestSort = (property: keyof TableRowData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [rows, order, orderBy, page]);

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.machineName}</TableCell>
                <TableCell>{row.machineType}</TableCell>
                <TableCell>{row.monitoringPointName}</TableCell>
                <TableCell>{row.sensorModel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </Paper>
  );
}
