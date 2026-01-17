'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { MenuItem, Select } from '@mui/material';

export function AddDialogButton(): React.JSX.Element {

  // Data
  const [open, setOpen] = React.useState(false);

  // Handlers
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries() as IterableIterator<[string, string]>);
    const nameInput = formObject.name;
    const typeInput = formObject.type;
    // TODO: Send data to backend, refreshing the machine table
    console.log(nameInput, typeInput);
    handleClose();
  };

  // Component
  return (
    <React.Fragment>
      <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="outlined" 
      onClick={handleClickOpen}
      >
        Add
      </Button>
      <Dialog open={open} 
      onClose={handleClose}
      >
        <DialogTitle>Add machine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Submit machine name and type:
          </DialogContentText>
          <form 
          onSubmit={handleSubmit} 
          id="add-machine-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              type="string"
              fullWidth
              variant="standard"
            />
            <Select
              required
              margin="dense"
              id="type"
              name="type"
              label="Machine type"
              defaultValue="Pump"
              type="string"
              fullWidth
              variant="standard"
            >
              <MenuItem value={'Pump'}>Pump</MenuItem>
              <MenuItem value={'Fan'}>Fan</MenuItem>
            </Select>
          </form>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={handleClose}
          >Cancel</Button>
          <Button type="submit" form="add-machine-form">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}