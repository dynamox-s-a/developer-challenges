import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, Typography, Stack } from '@mui/material';

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, type: string) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('pump');

  const handleSave = () => {
    onSave(name, type);
    setName('');
    setType('pump');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Add New Asset</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
          >
            <MenuItem value="pump">Pump</MenuItem>
            <MenuItem value="fan">Fan</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Stack>
      </Box>
    </Modal>
  );
};
