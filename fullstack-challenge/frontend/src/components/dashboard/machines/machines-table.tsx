'use client';

import * as React from 'react';

import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { InteractiveTable } from '../interactive-table';
import { Machine } from '@/lib/entity/machine';
import MachineRepository from '@/lib/repository/machine';

interface MachineTableProps {
  fetchRowsPromise: Promise<Machine[]>;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150, editable: false },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'type',
    headerName: 'Type',
    width: 220,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Fan', 'Pump'],
  }
];

export function MachinesTable({ fetchRowsPromise }: MachineTableProps): React.JSX.Element {
  const initialRows: GridRowsProp = React.use(fetchRowsPromise)
  const repository = new MachineRepository()

  return (
    <InteractiveTable
      columns={columns}
      initialRows={initialRows}
      // listRows={repository.list}
      // createRow={repository.create}
      handleUpdate={(row) => repository.update(row as Machine)}
      handleDelete={(row) => repository.delete(row as Machine)}
    />
  );
}