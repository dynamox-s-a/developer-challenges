'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/indext';
import { Box, Typography } from '@mui/material';

import { ModalMachineButton } from './modalMachineButton';
import { MachineCard } from './machineCard';
import { CreateMachineModal } from './createMachineModal';
import { Machine } from '@/store/machine/machine.types';

export function MachinesPageClient() {
  const machines = useSelector((state: RootState) =>
    state.machines.ids.map((id) => state.machines.entities[id]!)
  );

  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // ➕ criar
  function handleCreate() {
    setEditingMachine(null);
    setOpen(true);
  }

  // ⚙️ editar
  function handleEdit(machine: Machine) {
    setEditingMachine(machine);
    setOpen(true);
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Máquinas
      </Typography>

      <ModalMachineButton onClick={handleCreate} />

      <Box display="flex" flexWrap="wrap" gap={2} mt={3}>
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onSettings={handleEdit}
          />
        ))}
      </Box>

      <CreateMachineModal
        open={open}
        machine={editingMachine}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}
