'use client'

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { paths } from '@/paths';
import { machine_types } from '@/types';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';

import { MonitoringPointTable } from '@/components/dashboard/monitoring-point/monitoring-point-table';
import type { MonitoringPoint } from '@/components/dashboard/monitoring-point/monitoring-point-table';


let monitoringPoints = [
  {
    id: '1',
    name: 'Monitoring Point 01',
    type: 'TcAg',
    machine: 'Machine 01'
  },
  {
    id: '2',
    name: 'Monitoring Point 02',
    type: 'HF+',
    machine: 'Machine 02'
  }
] satisfies MonitoringPoint[];


export default function Page(): React.JSX.Element {
  //const [monitoringPoints, setData] = React.useState([]) 

  const page = 0;
  const rowsPerPage = 5;
  const router = useRouter();

  const paginatedMonitoringPoints = applyPagination(monitoringPoints, page, rowsPerPage);

  const handleDeleteClick = React.useCallback((evt) => {

    const objWithIdIndex = monitoringPoints.findIndex((obj) => obj.id === evt.currentTarget.id);
    monitoringPoints.splice(objWithIdIndex, 1);

    console.log('onClick', evt.currentTarget.id);

    //Remover item pela API
    /*React.useEffect(() => {
      Delete("/monitoring_point/"+evt.currentTarget.id).then((res) => {
          
          Get("/monitoring_point").then((res) => {
            setData(res.data);
          });

        })
    });*/

    router.refresh();
  }, []);

  //Carregar lista pela API
  /*React.useEffect(() => {
    Get("/monitoring_point").then((res) => {
      setData(res.data);
    });
  });
  */

  return (
    monitoringPoints.length > 0 &&
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring Points</Typography>
        </Stack>
      </Stack>
      <MonitoringPointTable
        count={paginatedMonitoringPoints.length}
        page={page}
        rows={paginatedMonitoringPoints}
        rowsPerPage={rowsPerPage}
        handleDeleteClick={handleDeleteClick}
      />
    </Stack>
  );
}

function applyPagination(rows: MonitoringPoint[], page: number, rowsPerPage: number): MonitoringPoint[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
