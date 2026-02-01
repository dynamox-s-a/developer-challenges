import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { MachineCard } from '@/components/dashboard/machine/machine-card';
import { MachineToolbar } from '@/components/dashboard/machine/machine-toolbar';
import type { Machine } from '@/types/machine';

const machines: Machine[] = [
  { id: 1, name: 'BDS-01', type: "Pump", status: "Active" },
  { id: 2, name: 'BDS-02', type: "Pump", status: "Active" },
  { id: 3, name: 'BDS-03', type: "Pump", status: "Active" },
  { id: 4, name: 'BDS-04', type: "Pump", status: "Active" },
  { id: 5, name: 'BDS-05', type: "Pump", status: "Active" },
  { id: 6, name: 'BDS-06', type: "Pump", status: "Active" },
  { id: 7, name: 'BDS-07', type: "Pump", status: "Active" },
  { id: 8, name: 'BDS-08', type: "Pump", status: "Active" },
  { id: 9, name: 'BDS-09', type: "Pump", status: "Active" },
  { id: 10, name: 'BDS-10', type: "Pump", status: "Active" },
  { id: 11, name: 'BDS-11', type: "Pump", status: "Active" },
  { id: 12, name: 'BDS-12', type: "Pump", status: "Active" },
  { id: 13, name: 'BDS-13', type: "Pump", status: "Active" },
  { id: 14, name: 'BDS-14', type: "Pump", status: "Active" },
  { id: 15, name: 'BDS-15', type: "Pump", status: "Active" },
  { id: 16, name: 'BDS-16', type: "Pump", status: "Active" },
  { id: 17, name: 'BDS-17', type: "Pump", status: "Active" },
  { id: 18, name: 'BDS-18', type: "Pump", status: "Active" },
  { id: 19, name: 'BDS-19', type: "Pump", status: "Active" },
  { id: 20, name: 'BDS-20', type: "Pump", status: "Active" },
  { id: 21, name: 'BDS-21', type: "Pump", status: "Active" },
  { id: 22, name: 'BDS-22', type: "Pump", status: "Active" },
  { id: 23, name: 'BDS-23', type: "Pump", status: "Active" },
  { id: 24, name: 'BDS-24', type: "Pump", status: "Active" },
];

export default function MachinePage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <MachineToolbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <Grid container spacing={3}>
        {filteredMachines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </Grid>
    </Stack>
  );
}