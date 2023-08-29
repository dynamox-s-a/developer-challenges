import { Stack, Button, Typography } from '@mui/material';
import { useState, useCallback } from 'react';

import { MachineType } from 'utils/constants';

import EditMachineDialog from '../edit-machine-dialog';

type MachineProps = {
  id: string;
  name: string;
  type: MachineType;
};

const Machine = ({ id, name, type }: MachineProps) => {
  const [isEditMachineDialogOpen, setEditMachineDialogOpen] = useState(false);

  const onToggleEditMachineDialog = useCallback(() => {
    setEditMachineDialogOpen((prevState) => !prevState);
  }, []);
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ border: '1px solid black', padding: 0.8, borderRadius: 0.8 }}
    >
      <Stack direction="column" spacing={0.4} sx={{ flex: 1 }}>
        <Typography variant="body1">Machine Name: {name}</Typography>
        <Typography variant="body2">Type: {type}</Typography>
      </Stack>
      <Button
        color="primary"
        aria-label="Edit machine"
        size="medium"
        onClick={onToggleEditMachineDialog}
      >
        Edit
      </Button>
      <Button color="error" aria-label="Remove machine" size="medium">
        Delete
      </Button>
      {isEditMachineDialogOpen && (
        <EditMachineDialog
          handleClose={onToggleEditMachineDialog}
          id={id}
          initialState={{ name, type }}
        />
      )}
    </Stack>
  );
};

export default Machine;
