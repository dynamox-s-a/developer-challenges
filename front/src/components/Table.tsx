/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table as MuiTable, TablePagination, TableSortLabel } from "@mui/material"
import { ReactNode, useState, useMemo } from "react"

export const Table = ({ 
  dataSource, 
  columns, 
  actionColumn 
}: { 
  dataSource: any[], 
  columns: { label: string, key: string }[],
  actionColumn: (id: number, item: any) => ReactNode 
}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<string>('')

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedData = useMemo(() => {
    return [...dataSource].sort((a, b) => {
      if (orderBy) {
        const aValue = a[orderBy]
        const bValue = b[orderBy]
        
        const numA = typeof aValue === 'number' ? aValue : parseFloat(aValue)
        const numB = typeof bValue === 'number' ? bValue : parseFloat(bValue)
        
        if (numA < numB) {
          return order === 'asc' ? -1 : 1
        }
        if (numA > numB) {
          return order === 'asc' ? 1 : -1
        }
      }
      return 0
    })
  }, [dataSource, order, orderBy])

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <TableContainer component={Paper} sx={{ marginLeft: "0" }}>
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : 'asc'}
                    onClick={() => handleRequestSort(col.key)}
                    hideSortIcon={false}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        visibility: 'visible',
                        opacity: 1
                      },
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ maxWidth: 22 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{item[col.key]}</TableCell>
                ))}
                <TableCell sx={{ maxWidth: 22 }}>
                  {actionColumn(item.id, item)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
        <TablePagination
          component="div"
          count={dataSource.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Itens por página"
        />
      </TableContainer>
    </>
  )
}
