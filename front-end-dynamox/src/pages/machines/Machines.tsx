import React, { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function Machines() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [machines, setMachines] = useState<{ name: string; type: string }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); 

  const AddMachine = () => {
    if (name && type) {
      setMachines([...machines, { name, type }]);
      setName('');
      setType('');
    }
  };

  const DeleteMachine = (index: number) => {
    const newMachines = machines.filter((_, i) => i !== index);
    setMachines(newMachines);
  };

  const EditMachine = (index: number) => {
    setEditingIndex(index); 
    setName(machines[index].name);
    setType(machines[index].type);
  };

  const SaveMachine = () => {
    if (editingIndex !== null && name && type) {
      const updatedMachines = [...machines];
      updatedMachines[editingIndex] = { name, type }; 
      setMachines(updatedMachines);
      setEditingIndex(null); 
      setName('');
      setType('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 6,
        gap: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Machine Management
      </Typography>

      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <TextField
          label="Machine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </FormControl>
        {editingIndex === null ? (
          <Button variant="contained" onClick={AddMachine} fullWidth>
            Add Machine
          </Button>
        ) : (
          <Button variant="contained" onClick={SaveMachine} fullWidth>
            Save Changes
          </Button>
        )}
      </Box>

      <Box sx={{ width: '100%', marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((machine, index) => (
              <TableRow key={index}>
                <TableCell>{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => EditMachine(index)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => DeleteMachine(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
