'use client';

import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ModalMachineButtonProps {
  onClick: () => void;
}

export function ModalMachineButton({ onClick }: ModalMachineButtonProps) {
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <AddIcon />
    </Fab>
  );
}
