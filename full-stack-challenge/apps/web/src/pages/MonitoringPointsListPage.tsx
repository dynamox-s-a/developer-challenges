import type {
  MonitoringPointListItemDto,
  MonitoringPointSortField,
} from '@dynapredict/shared-types';
import ShowChart from '@mui/icons-material/ShowChart';
import { Button, Link, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import {
  fetchMonitoringPoints,
  pageChanged,
  pageSizeChanged,
  sortChanged,
} from '../features/monitoringPoints/monitoringPointsSlice';

type Row = MonitoringPointListItemDto;

function NoSensor() {
  return (
    <Typography component="span" variant="body2" color="text.secondary">
      No sensor
    </Typography>
  );
}

const columns: DataTableColumn<Row, MonitoringPointSortField>[] = [
  {
    id: 'machineName',
    header: 'Machine',
    sortField: 'machineName',
    render: (row) => (
      <Link component={RouterLink} to={`/machines/${row.machine.id}`}>
        {row.machine.name}
      </Link>
    ),
  },
  {
    id: 'machineType',
    header: 'Machine type',
    sortField: 'machineType',
    render: (row) => row.machine.type,
  },
  {
    id: 'pointName',
    header: 'Monitoring point',
    sortField: 'pointName',
    render: (row) => row.name,
  },
  {
    id: 'sensorModel',
    header: 'Sensor model',
    sortField: 'sensorModel',
    render: (row) => row.sensor?.model ?? <NoSensor />,
  },
  {
    id: 'serialNumber',
    header: 'Sensor serial',
    render: (row) => row.sensor?.serialNumber ?? <NoSensor />,
  },
  {
    id: 'series',
    header: 'Readings',
    align: 'right',
    // Readings belong to the sensor, so a point without one has no series.
    render: (row) =>
      row.sensor ? (
        <Button
          component={RouterLink}
          to={`/monitoring-points/${row.id}/series`}
          size="small"
          startIcon={<ShowChart />}
          aria-label={`View series of ${row.name} on ${row.machine.name}`}
          sx={{ minHeight: 44, whiteSpace: 'nowrap' }}
        >
          Series
        </Button>
      ) : (
        <NoSensor />
      ),
  },
];

/** Every monitoring point of every machine, paginated and sorted server-side. */
export function MonitoringPointsListPage() {
  const dispatch = useAppDispatch();
  const { rows, meta, query, status, error } = useAppSelector(
    (state) => state.monitoringPoints,
  );

  useEffect(() => {
    void dispatch(fetchMonitoringPoints());
  }, [dispatch, query]);

  return (
    <Stack spacing={2}>
      <div>
        <Typography component="h1" variant="h4">
          Monitoring points
        </Typography>
        <Typography color="text.secondary">
          All points across machines. Add points and sensors from a
          machine&apos;s page.
        </Typography>
      </div>

      <DataTable<Row, MonitoringPointSortField>
        label="Monitoring points"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        page={query.page}
        pageSize={query.pageSize}
        total={meta?.total ?? 0}
        pageSizeOptions={[5, 10, 25]}
        onPageChange={(page) => dispatch(pageChanged(page))}
        onPageSizeChange={(size) => dispatch(pageSizeChanged(size))}
        sort={{ by: query.sortBy, dir: query.sortDir }}
        onSortChange={({ by, dir }) =>
          dispatch(sortChanged({ sortBy: by, sortDir: dir }))
        }
        loading={status === 'loading'}
        error={error?.message}
        onRetry={() => void dispatch(fetchMonitoringPoints())}
        emptyMessage="No monitoring points yet. Open a machine to add one."
        minWidth={760}
      />
    </Stack>
  );
}

export default MonitoringPointsListPage;
