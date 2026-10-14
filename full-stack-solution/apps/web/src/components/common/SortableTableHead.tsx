import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { SortOrder } from "@full-stack-solution/shared";

export interface SortableColumn<Field extends string> {
  /** Sort key sent to the API; `undefined` makes the column non-sortable. */
  field?: Field;
  label: string;
  align?: "left" | "right" | "center";
}

export interface SortableTableHeadProps<Field extends string> {
  columns: SortableColumn<Field>[];
  sortBy: Field;
  order: SortOrder;
  onSort: (field: Field) => void;
}

/**
 * Table header with sort indicators.
 *
 * Generic over the sort field so the compiler rejects a column that the API
 * cannot sort by.
 */
export function SortableTableHead<Field extends string>({
  columns,
  sortBy,
  order,
  onSort,
}: SortableTableHeadProps<Field>) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column, index) => {
          const active = column.field !== undefined && column.field === sortBy;

          return (
            <TableCell
              key={column.field ?? `column-${index}`}
              align={column.align}
              sortDirection={active ? order : false}
            >
              {column.field ? (
                <TableSortLabel
                  active={active}
                  direction={active ? order : "asc"}
                  onClick={() => onSort(column.field as Field)}
                >
                  {column.label}
                </TableSortLabel>
              ) : (
                column.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
