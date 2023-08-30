import { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Pagination,
  Container,
  Stack,
  Typography,
  TableSortLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import Head from 'next/head';

import DashboardLayout from 'layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'store/store';
import { getMonitoringPoints } from 'store/features/monitoring-points-slice';

enum OrderBy {
  MachineName = 'machine.name',
  MachineType = 'machine.type',
  Name = 'name',
  SensorModel = 'sensorModel',
}
const MonitoringPoints = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.MachineName);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  console.log('orderBy', orderBy);
  console.log('order', order);
  const monitoringPoints = useAppSelector(
    (state) => state.monitoringPoints.monitoringPoints
  );
  const pagination = useAppSelector(
    (state) => state.monitoringPoints.pagination
  );
  const lastPage = pagination?.last as number;
  const isGettingMonitoringPoints = useAppSelector(
    (state) => state.loading.getMonitoringPoints
  );

  useEffect(() => {
    dispatch(getMonitoringPoints({ page, order, orderBy }));
  }, [dispatch, order, orderBy, page]);

  // Function to handle sorting
  const handleSort = useCallback(
    (property: OrderBy) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
      setPage(1);
    },
    [order, orderBy]
  );

  // Function to handle pagination
  const handleChangePage = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      console.log('value', value);
      setPage(value);
    },
    []
  );

  console.log('page', page);
  return (
    <>
      <Head>
        <title>Monitoring Points</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Monitoring Points</Typography>
              </Stack>
            </Stack>
            <Stack direction="column" spacing={1}>
              {isGettingMonitoringPoints ? (
                'Loading'
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            onClick={() => handleSort(OrderBy.MachineName)}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableSortLabel
                              active={orderBy === OrderBy.MachineName}
                              direction={
                                orderBy === OrderBy.MachineName
                                  ? order === 'asc'
                                    ? 'asc'
                                    : 'desc'
                                  : 'asc'
                              }
                            >
                              Machine Name
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            onClick={() => handleSort(OrderBy.MachineType)}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableSortLabel
                              active={orderBy === OrderBy.MachineType}
                              direction={
                                orderBy === OrderBy.MachineType
                                  ? order === 'asc'
                                    ? 'asc'
                                    : 'desc'
                                  : 'asc'
                              }
                            >
                              Machine Type
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            onClick={() => handleSort(OrderBy.Name)}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableSortLabel
                              active={orderBy === OrderBy.Name}
                              direction={
                                orderBy === OrderBy.Name
                                  ? order === 'asc'
                                    ? 'asc'
                                    : 'desc'
                                  : 'asc'
                              }
                            >
                              Monitoring Point Name
                            </TableSortLabel>
                          </TableCell>
                          <TableCell
                            onClick={() => handleSort(OrderBy.SensorModel)}
                            style={{ cursor: 'pointer' }}
                          >
                            <TableSortLabel
                              active={orderBy === OrderBy.SensorModel}
                              direction={
                                orderBy === OrderBy.SensorModel
                                  ? order === 'asc'
                                    ? 'asc'
                                    : 'desc'
                                  : 'asc'
                              }
                            >
                              Sensor Model
                            </TableSortLabel>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monitoringPoints.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.machine?.name}</TableCell>
                            <TableCell>{row.machine?.type}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.sensorModel}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Pagination
                      count={lastPage}
                      page={page}
                      size="small"
                      onChange={handleChangePage}
                    />
                  </Box>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

MonitoringPoints.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default MonitoringPoints;
