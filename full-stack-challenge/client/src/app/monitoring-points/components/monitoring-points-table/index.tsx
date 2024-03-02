'use client';
import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DateFormatter from 'client/src/app/core/components/date-formatter';
import { useAuthContext } from 'client/src/app/login/providers/auth-provider';
import { RemoteMonitoringPointType } from 'client/src/app/monitoring-points/types/remote-monitoring-point-type';
import { fetchPointsByUser } from 'client/src/app/store/slices/monitoring-points-slice';
import { AppDispatch } from 'client/src/app/store/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getComparator from './helpers/get-comparator';
import stableSort from './helpers/stable-sort';
import EnhancedTableHead from './table-head';
import EnhancedTableToolbar from './table-toolbar';

export type Order = 'asc' | 'desc';

export default function MonitoringPointsTable() {
  const [data, setData] = React.useState<RemoteMonitoringPointType[]>([]);
  const { user, isAuthenticating } = useAuthContext();
  const { monitoringPoints } = useSelector(
    (state: {
      monitoringPoints: {
        monitoringPoints: RemoteMonitoringPointType[];
        status: any;
      };
    }) => {
      return state;
    }
  );

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    const data = monitoringPoints.monitoringPoints;
    if (monitoringPoints.status === 'success') {
      setData(data);
    }
  }, [monitoringPoints]);

  React.useEffect(() => {
    if (!isAuthenticating && !!user) {
      dispatch(fetchPointsByUser(user?.sub));
    }
  }, []);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof RemoteMonitoringPointType>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof RemoteMonitoringPointType
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  if (!data || data.length < 1) {
    return (
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ borderRadius: 1 }}
        width={'99%'}
        height={360}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row}.${index}`}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row._id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>

                    <TableCell align="center">{row.userId}</TableCell>
                    <TableCell align="center">{row.machineId}</TableCell>
                    <TableCell align="center">{row.machineName}</TableCell>
                    <TableCell align="center">{row.machineStatus}</TableCell>
                    <TableCell align="center">{row.machineType}</TableCell>
                    <TableCell align="center">{row.sensorId}</TableCell>
                    <TableCell align="center">{row.sensorModelName}</TableCell>
                    <TableCell align="center">
                      <DateFormatter>{row.createdAt}</DateFormatter>
                    </TableCell>
                    <TableCell align="center">
                      <DateFormatter>{row.updatedAt}</DateFormatter>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
