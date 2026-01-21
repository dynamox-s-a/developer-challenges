/**
 * View responsável por listar e gerenciar as máquinas cadastradas.
 *
 * Renderiza os cards em uma grade 2x2 com limite máximo de máquinas,
 * controla os modais de criação/edição e a adição de pontos de monitoramento.
 */

'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/indext';
import { Box, Typography } from '@mui/material';

import { ModalButton } from './modalButton';
import { MachineCard } from './machineCard';
import { MachineModal } from './machineModal';
import { Machine } from '@/store/machine/machine.types';
import { deleteMachine } from '@/store/machine/machine.slices';
import { MonitoringModal } from '@/components/monitoring/monitoringModal';
import { deleteMonitoringPointsByMachine } from '@/store/monitoring/monitoring.slices';

export function MachineView() {
  const dispatch = useDispatch();

  const machines = useSelector((state: RootState) =>
    state.machines.ids.map((id) => state.machines.entities[id]!)
  );

  const canAddMachine = machines.length < 4;

  const [open, setOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [openMonitoring, setOpenMonitoring] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  function handleCreate() {
    setEditingMachine(null);
    setOpen(true);
  }

  function handleEdit(machine: Machine) {
    setEditingMachine(machine);
    setOpen(true);
  }

  function handleDelete(id: string) {
    dispatch(deleteMachine(id));
    dispatch(deleteMonitoringPointsByMachine(id));
  }

  function handleAddMonitoring(machine: Machine) {
    setSelectedMachine(machine);
    setOpenMonitoring(true);
  }

  function closeMonitoring() {
    setOpenMonitoring(false);
    setSelectedMachine(null);
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Máquinas
      </Typography>

      <ModalButton onClick={handleCreate} disabled={!canAddMachine} />

      <Box mt={3} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={50}>
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onSettings={handleEdit}
            onDelete={handleDelete}
            onAddPoint={handleAddMonitoring}
          />
        ))}
      </Box>

      <MachineModal
        open={open}
        machine={editingMachine}
        onClose={() => setOpen(false)}
      />

      {selectedMachine && (
        <MonitoringModal
          open={openMonitoring}
          machine={selectedMachine}
          onClose={closeMonitoring}
        />
      )}
    </Box>
  );
}
