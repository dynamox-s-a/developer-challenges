import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

/** Number of columns per breakpoint. Omitted breakpoints inherit the previous one. */
export interface GridColumns {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface ResponsiveGridProps {
  children: ReactNode;
  /**
   * Columns per breakpoint. Explicit on purpose: the number of cells per row is
   * a layout decision (six metric cards read best as 3 + 3), not something to
   * be derived from the available width.
   */
  columns?: GridColumns;
  /** Gap between cells, in theme spacing units. */
  gap?: number;
  sx?: SxProps<Theme>;
}

const DEFAULT_COLUMNS: GridColumns = { xs: 1, sm: 2, md: 3 };

/**
 * Equal-width responsive grid for cards and form rows.
 *
 * Uses native CSS grid with `gap` instead of MUI 5's `Grid`. `Grid` lays
 * spacing out with a negative margin on the container
 * (`margin-left: -16px; width: calc(100% + 16px)`) compensated by
 * `padding-left: 16px` on every item: the cell contents line up, but the
 * container box hangs 16px outside its siblings and bleeds into the padding of
 * whatever contains it. `gap` has no such offset, so cells align with the page
 * header and the full-width cards by construction.
 *
 * `minmax(0, 1fr)` keeps a cell from being pushed wider than its share by long
 * content, which is what `1fr` alone would allow.
 */
export function ResponsiveGrid({
  children,
  columns = DEFAULT_COLUMNS,
  gap = 2,
  sx,
}: ResponsiveGridProps) {
  const gridTemplateColumns = Object.fromEntries(
    Object.entries(columns).map(([breakpoint, count]) => [
      breakpoint,
      `repeat(${count}, minmax(0, 1fr))`,
    ]),
  );

  return (
    <Box
      sx={[
        { display: "grid", gap, gridTemplateColumns, alignItems: "stretch" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
