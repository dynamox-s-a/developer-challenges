'use client'

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";

export interface Machine {
    id: string;
    name: string;
    type: 'pump' | 'fan';
  }

export function MachineTable({paginatedMachines}: {paginatedMachines: Machine[]}) {
    return (
    <>
    {paginatedMachines.map((machine) => (
        <Card key={machine.id} sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
          <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <Typography variant="h6" sx={{ minWidth: '200px' }}>{machine.name}</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">Type: {machine.type} </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" color="primary" onClick={() => {
                    // Handle edit
                }}>Edit</Button>
                <Button variant="contained" color="error" onClick={() => {
                    // Handle delete
                }}>Delete</Button>
            </Stack>
          </CardContent>
        </Card>
    ))}
    </>
    )
}