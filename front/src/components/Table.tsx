/* eslint-disable @typescript-eslint/no-explicit-any */
import {   
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Table as MuiTable 
} from "@mui/material"
import { ReactNode } from "react"

export const Table = ({ 
  dataSource, 
  columns,
  actionColumn 
}: { 
  dataSource: any[], 
  columns: string[]
  actionColumn: (id: number, item: any) => ReactNode
}) => {

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, marginLeft: "0" }}>
    <MuiTable>
      <TableHead>
        <TableRow>
          {columns.map((col) => <TableCell>{col}</TableCell>)}
          <TableCell sx={{ maxWidth: 22 }}>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSource.map((item) => (
          <TableRow key={item.id}>
            {Object.keys(item).map((key) => <TableCell key={key}>{item[key]}</TableCell>)}
            <TableCell sx={{ maxWidth: 22 }}>
              {actionColumn(item.id, item)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  </TableContainer>
  )
}
