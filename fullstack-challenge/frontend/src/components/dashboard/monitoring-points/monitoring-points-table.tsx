'use client';

import * as React from 'react';

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { InteractiveTable } from '../interactive-table';
import { MonitoringPoint } from '@/lib/entity/monitoring-point';
import MonitoringPointRepository from '@/lib/repository/monitoring-point';

interface MonitoringPointTableProps {
  fetchRowsPromise: Promise<MonitoringPoint[]>;
}

  // const initialRows: GridRowsProp = [
  //   { id: '001', name: 'IT-001', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  //   { id: '002', name: 'IT-002', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  //   { id: '003', name: 'IT-003', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  //   { id: '005', name: 'IT-005', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Pump', },
  //   { id: '006', name: 'IT-006', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  //   { id: '007', name: 'IT-007', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  //   { id: '008', name: 'IT-008', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  //   { id: '009', name: 'IT-009', type: 'HF+', machineId: '001', machineName: 'AEP-001', machineType: 'Fan', },
  // ] satisfies MonitoringPoints[];
  
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150, editable: false },
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
        field: 'type',
        headerName: 'Type',
        width: 220,
        editable: true,
        type: 'singleSelect',
        // valueOptions: ["TcAg", "TcAs", "HF+"]
        valueOptions: ({ row }) => {
          if (row.machineType === 'Fan') {
            return ["TcAg", "TcAs", "HF+"];
          }
          if (row.machineType === 'Pump') {
            return ["HF+"];
          }
          return []; // Default empty
        },
    },
    { field: 'machineId', headerName: 'Machined ID', width: 180, editable: true },
    { field: 'machineName', headerName: 'Machine name', width: 180, editable: false },
    { field: 'machineType', headerName: 'Machine type', width: 180, editable: false },
  ];

export function MonitoringPointsTable({ fetchRowsPromise }: MonitoringPointTableProps): React.JSX.Element {
  const initialRows: GridRowsProp = React.use(fetchRowsPromise)
  const repository = new MonitoringPointRepository()

  return (
    <InteractiveTable
      columns={columns}
      initialRows={initialRows}
      // listRows={repository.list}
      // createRow={repository.create}
      handleUpdate={(row) => repository.update(row as MonitoringPoint)}
      handleDelete={(row) => repository.delete(row as MonitoringPoint)}
    />
  );
}