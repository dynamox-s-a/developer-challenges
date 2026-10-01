import type { SortOrder } from '@condition-monitor/shared';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { ReactNode } from 'react';

export interface SortableColumn<Key extends string> {
  key: Key;
  label: string;
}

export interface SortableTableHeadProps<Key extends string> {
  columns: readonly SortableColumn<Key>[];
  /** The column the list is sorted by, and its direction. */
  sort: Key;
  order: SortOrder;
  /** Called with the column clicked and the direction it should take. */
  onSort: (key: Key, order: SortOrder) => void;
  /** Cells after the sortable ones, such as an actions column. */
  children?: ReactNode;
}

/**
 * The direction a click on a column asks for: ascending first, and the opposite when the
 * list is already sorted by that column in ascending order.
 */
export function nextOrder<Key extends string>(
  current: { sort: Key; order: SortOrder },
  key: Key,
): SortOrder {
  return current.sort === key && current.order === 'asc' ? 'desc' : 'asc';
}

/**
 * Head of a list sorted on the server: every column is a button, and the sorted one says
 * its direction to screen readers through `aria-sort`. The component holds no state; the
 * list owns the sort and reloads when asked.
 */
export function SortableTableHead<Key extends string>({
  columns,
  sort,
  order,
  onSort,
  children,
}: SortableTableHeadProps<Key>) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.key} sortDirection={sort === column.key ? order : false}>
            <TableSortLabel
              active={sort === column.key}
              direction={sort === column.key ? order : 'asc'}
              onClick={() => onSort(column.key, nextOrder({ sort, order }, column.key))}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
        {children}
      </TableRow>
    </TableHead>
  );
}
