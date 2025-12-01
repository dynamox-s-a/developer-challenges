import { TableCell, TableSortLabel } from '@mui/material';

interface SortableTableHeaderProps {
  field: string;
  label: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const SortableTableHeader = ({ field, label, sortField, sortOrder, onSort }: SortableTableHeaderProps) => (
  <TableCell>
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortOrder : 'asc'}
      onClick={() => onSort(field)}
    >
      <strong>{label}</strong>
    </TableSortLabel>
  </TableCell>
);