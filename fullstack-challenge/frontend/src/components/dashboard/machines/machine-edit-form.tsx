'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem, Select } from '@mui/material';

export function EditDialogButton(): React.JSX.Element {

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

  return (
    <React.Fragment>
      <Button variant="outlined" 
      onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog open={open} 
      onClose={handleClose}
      >
        <DialogTitle>\Edit machine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Submit machine name and type:
          </DialogContentText>
          <form 
          onSubmit={handleSubmit} 
          id="edit-machine-form">
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
          <Button type="submit" form="edit-machine-form">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}