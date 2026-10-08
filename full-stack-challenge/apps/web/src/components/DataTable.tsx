import type { SortDirection } from '@dynapredict/shared-types';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface DataTableColumn<T, K extends string = string> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Server-side sort key; columns without one are not sortable. */
  sortField?: K;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableSort<K extends string> {
  by: K;
  dir: SortDirection;
}

export interface DataTableProps<T, K extends string = string> {
  /** Accessible name of the table, e.g. "Machines". */
  label: string;
  columns: DataTableColumn<T, K>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** 1-based, like the API. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** The parent should also go back to page 1. */
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  sort?: DataTableSort<K>;
  onSortChange?: (sort: DataTableSort<K>) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  /**
   * Below this width the table scrolls horizontally inside its container,
   * so the page itself never does.
   */
  minWidth?: number;
}

/** Clicking the active column flips it; another column starts ascending. */
export function nextSort<K extends string>(
  current: DataTableSort<K> | undefined,
  by: K,
): DataTableSort<K> {
  if (current?.by === by) {
    return { by, dir: current.dir === 'asc' ? 'desc' : 'asc' };
  }
  return { by, dir: 'asc' };
}

/**
 * A controlled table for server-side paginated, sortable listings. It keeps
 * no state: the parent (a slice) owns page, size and sort, and refetches
 * when a callback fires.
 */
export function DataTable<T, K extends string = string>({
  label,
  columns,
  rows,
  getRowId,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25],
  sort,
  onSortChange,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No records found.',
  minWidth = 600,
}: DataTableProps<T, K>) {
  // MUI pages are 0-based and must stay in range: a delete can shrink the
  // total before the parent moves back a page.
  const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const muiPage = Math.min(Math.max(page - 1, 0), lastPage);

  return (
    <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: 0 }}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      )}
      {/* Fixed height so the rows don't jump while loading. */}
      <Box sx={{ height: 4 }}>
        {loading && <LinearProgress aria-label={`Loading ${label}`} />}
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table aria-label={label} aria-busy={loading} sx={{ minWidth }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const activeDir =
                  sort && sort.by === column.sortField ? sort.dir : undefined;
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sortDirection={activeDir ?? false}
                    sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    {column.sortField && onSortChange ? (
                      <TableSortLabel
                        active={activeDir !== undefined}
                        direction={activeDir ?? 'asc'}
                        onClick={() =>
                          onSortChange(nextSort(sort, column.sortField as K))
                        }
                        sx={{ minHeight: 44 }}
                      >
                        {column.header}
                      </TableSortLabel>
                    ) : (
                      column.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {emptyMessage}
                </TableCell>
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
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={muiPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={pageSizeOptions}
        onPageChange={(_, next) => onPageChange(next + 1)}
        onRowsPerPageChange={(event) =>
          onPageSizeChange(Number(event.target.value))
        }
        labelRowsPerPage="Rows:"
        // Native select: the OS picker is easier to use on touch screens.
        // MUI doesn't link the visible label to a native select, so name it.
        SelectProps={{
          native: true,
          inputProps: { 'aria-label': 'Rows per page' },
        }}
        sx={{
          // At 360px the controls don't fit on one line: let them wrap.
          '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', px: 1 },
          '& .MuiTablePagination-actions button': { width: 44, height: 44 },
        }}
      />
    </Paper>
  );
}
