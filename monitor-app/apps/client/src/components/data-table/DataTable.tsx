import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import { visuallyHidden } from '@mui/utils'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { theme } from 'theme'

interface TableProps<T> {
  data: T[]
  tableTitle: string
}

type Order = 'asc' | 'desc'

export default function DataTable<T extends object>({ data, tableTitle }: TableProps<T>) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof T | string>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const pathname = usePathname()

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const visibleRows = useMemo(
    () =>
      data.slice().sort((a, b) => {
        if (order === 'asc') {
          return a[orderBy as keyof T] < b[orderBy as keyof T] ? -1 : 1
        }
        return b[orderBy as keyof T] < a[orderBy as keyof T] ? -1 : 1
      }),
    [data, order, orderBy]
  )

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ width: '100%', display: isLgUp ? 'block' : 'table', tableLayout: 'fixed' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 }
            }}
          >
            <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
              {tableTitle}
            </Typography>
            <Button
              component={Link}
              href={`${pathname}/create`}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ px: isSmUp ? '' : 3 }}
            >
              {tableTitle.slice(0, -1)}
            </Button>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 325 }}>
              <TableHead>
                <TableRow>
                  {Object.keys(data[0])
                    .slice(1)
                    .map((headCell, index) => (
                      <TableCell
                        key={headCell}
                        align={index === 0 ? 'left' : 'right'}
                        sortDirection={orderBy === headCell ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell}
                          direction={orderBy === headCell ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell)}
                          sx={{ fontWeight: '600', textTransform: 'capitalize' }}
                        >
                          {headCell}
                          {orderBy === headCell ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover tabIndex={-1} key={Object.values(row)[1]}>
                        {Object.values(row)
                          .slice(1)
                          .map((cell, index) => (
                            <TableCell align={index === 0 ? 'left' : 'right'} key={cell}>
                              {cell}
                            </TableCell>
                          ))}
                        <TableCell padding="checkbox">
                          <IconButton onClick={handleClick} size={'small'}>
                            <SettingsIcon />
                          </IconButton>
                          <Menu
                            elevation={1}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          >
                            <MenuItem
                              component={Link}
                              href={`${pathname}/edit/${Object.values(row)[0]}`}
                            >
                              <ListItemIcon>
                                <EditIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Edit</ListItemText>
                            </MenuItem>
                            <MenuItem>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Delete</ListItemText>
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  )
}
