import { useState } from 'react';
import type { Machine } from '../features/machine/MachinesSlice';
import { Container } from '@mui/material';
import MachineForm from '../features/machine/MachineForm';
import MachineList from '../features/machine/MachineList';

export default function DashboardPage() {
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <MachineForm
              selectedMachine={selectedMachine}
              onClear={() => setSelectedMachine(null)}
            />
            <MachineList onSelect={setSelectedMachine} />
        </Container>
    );
}
