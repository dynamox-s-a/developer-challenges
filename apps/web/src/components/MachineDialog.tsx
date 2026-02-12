import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'
import type {
  CreateMachineInput,
  Machine
} from '../features/machines/machinesTypes'

type MachineType = CreateMachineInput['type']

interface MachineDialogProps {
  open: boolean
  editingMachine: Machine | null
  formName: string
  formType: MachineType
  formError: string | null
  actionLoading: boolean
  onClose: () => void
  onSave: () => void
  onNameChange: (value: string) => void
  onTypeChange: (value: MachineType) => void
}

export function MachineDialog({
  open,
  editingMachine,
  formName,
  formType,
  formError,
  actionLoading,
  onClose,
  onSave,
  onNameChange,
  onTypeChange
}: MachineDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>{editingMachine ? 'Editar máquina' : 'Criar máquina'}</DialogTitle>
      <DialogContent sx={{ paddingTop: '20px !important' }}>
        <Stack spacing={2.5}>
          {formError && <Alert severity='error'>{formError}</Alert>}
          <TextField
            autoFocus
            fullWidth
            label='Nome'
            value={formName}
            onChange={(event) => onNameChange(event.target.value)}
          />
          <TextField
            select
            fullWidth
            label='Tipo'
            value={formType}
            onChange={(event) => onTypeChange(event.target.value as MachineType)}
          >
            <MenuItem value='Pump'>Pump</MenuItem>
            <MenuItem value='Fan'>Fan</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={actionLoading}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          disabled={actionLoading || !formName.trim()}
          onClick={onSave}
        >
          {editingMachine ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
