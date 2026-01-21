/**
 * Botão flutuante responsável por abrir o modal de criação de máquinas.
 *
 * Exibe tooltip quando o limite máximo de máquinas é atingido.
 */

'use client';

import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ModalButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ModalButton({ onClick, disabled }: ModalButtonProps) {
  return (
    <Tooltip title={disabled ? 'Limite máximo de 4 máquinas atingido' : ''}>
      <span>
        <Fab
          color="primary"
          aria-label="add"
          onClick={onClick}
          disabled={disabled}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </span>
    </Tooltip>
  );
}
