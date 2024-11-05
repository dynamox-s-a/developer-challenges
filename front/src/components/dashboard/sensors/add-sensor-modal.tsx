import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, Typography, Stack } from '@mui/material';

interface AddSensorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, type: string, assetId: string) => void;
  assets: { id: string; name: string }[];
}

export const AddSensorModal: React.FC<AddSensorModalProps> = ({ open, onClose, onSave, assets }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('TcAg');
  const [assetId, setAssetId] = useState('');

  const handleSave = () => {
    onSave(name, type, assetId);
    setName('');
    setType('TcAg');
    setAssetId('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Add New Sensor</Typography>
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
            <MenuItem value="TcAg">TcAg</MenuItem>
            <MenuItem value="TcAs">TcAs</MenuItem>
            <MenuItem value="HF+">HF+</MenuItem>
          </Select>
          <Select
            label="Asset"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            fullWidth
          >
            {assets.map((asset) => (
              <MenuItem key={asset.id} value={asset.id}>{asset.name}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Stack>
      </Box>
    </Modal>
  );
};
