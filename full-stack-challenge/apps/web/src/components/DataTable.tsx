import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSort?: (columnId: string) => void;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  emptyMessage = 'No data',
  sortBy,
  sortDirection = 'asc',
  onSort,
}: DataTableProps<T>) {
  const colSpan = columns.length;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              sortDirection={sortBy === column.id ? sortDirection : false}
            >
              {column.sortable && onSort ? (
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortBy === column.id ? sortDirection : 'asc'}
                  onClick={() => onSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              ) : (
                column.label
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading && rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={colSpan}>Loading...</TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={colSpan}>{emptyMessage}</TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={getRowId(row)} hover>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
