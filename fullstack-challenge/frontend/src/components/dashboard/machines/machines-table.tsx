'use client';

import * as React from 'react';

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { InteractiveTable } from '../interactive-table';
import { Machine } from '@/lib/entity/machine';
import MachineRepository from '@/lib/repository/machine';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150, editable: false },
  { field: 'name', headerName: 'Machine Name', width: 180, editable: true },
  {
    field: 'type',
    headerName: 'Machine Type',
    width: 220,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Fan', 'Pump'],
  }
];

const machineTemplate = {
  name: "",
  type: ""
}

export async function MachinesTable(): Promise<React.JSX.Element> {
  const repository = new MachineRepository()

  return (
    <InteractiveTable
      rowTemplate={machineTemplate}
      columns={columns}
      initialRows={[] as GridRowsProp}
      handleRefresh={() => repository.list()}
      handleCreate={(row) => repository.create(row as Machine)}
      handleUpdate={(row) => repository.update(row as Machine)}
      handleDelete={(row) => repository.delete(row as Machine)}
    />
  );
}