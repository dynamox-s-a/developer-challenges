import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";

interface TableProps {
  columns: { header: string; accessor: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

const Table = ({ columns, renderRow, data }: TableProps) => {
  return (
    <TableContainer>
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.accessor}>
                <h3 className="font-semibold">{col.header}</h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{data.map((item) => renderRow(item))}</TableBody>
      </MuiTable>
    </TableContainer>
  );
};
export default Table;
