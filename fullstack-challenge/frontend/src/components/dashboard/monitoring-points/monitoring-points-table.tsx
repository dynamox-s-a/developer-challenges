'use client';

import * as React from 'react';

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { InteractiveTable } from '../interactive-table';
import { MonitoringPoint } from '@/lib/entity/monitoring-point';
import MonitoringPointRepository from '@/lib/repository/monitoring-point';

interface MonitoringPointTableProps {
  fetchRowsPromise: Promise<MonitoringPoint[]>;
}
  
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150, editable: false },
  { field: 'name', headerName: 'Monitoring Point Name', width: 180, editable: true },
  {
      field: 'type',
      headerName: 'Sensor Model',
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
        return ["HF+"]; // Default empty
      },
  },
  { field: 'machineId', headerName: 'Machined ID', width: 180, editable: true },
  { field: 'machineName', headerName: 'Machine Name', width: 180, editable: false },
  { field: 'machineType', headerName: 'Machine Type', width: 180, editable: false },
];

const monitoringPointTemplate = { 
  id: 0, 
  name: '', 
  type: '', 
  machineId: 0, 
  machineName: '', 
  machineType: '', 
}

export async function MonitoringPointsTable(): Promise<React.JSX.Element> {
  const repository = new MonitoringPointRepository()
  // const initialRows: GridRowsProp = await repository.list();

  return (
    <InteractiveTable
      rowTemplate={monitoringPointTemplate}
      columns={columns}
      initialRows={[] as GridRowsProp}
      handleRefresh={() => repository.list()}
      handleCreate={(row) => repository.create(row as MonitoringPoint)}
      handleUpdate={(row) => repository.update(row as MonitoringPoint)}
      handleDelete={(row) => repository.delete(row as MonitoringPoint)}
    />
  );
}