import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { Machine } from "../../types/machines";
  import { SelectChangeEvent } from '@mui/material';

  interface Props {
    onSubmit: (data: { name: string; type: string }, id?: string) => void;
    editingMachine: Machine | null;
    clearEditing: () => void;
  }
  
  export default function MachineForm({
    onSubmit,
    editingMachine,
    clearEditing,
  }: Props) {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
  
    useEffect(() => {
      if (editingMachine) {
        setName(editingMachine.name);
        setType(editingMachine.type);
      }
    }, [editingMachine]);
  
    const handleSubmit = () => {
      if (!name || !type) return;
      onSubmit({ name, type }, editingMachine?._id);
      setName("");
      setType("");
      clearEditing();
    };
  
    return (
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <TextField
          label="Machine Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e: SelectChangeEvent<string>) => setType(e.target.value)}
            label="Type"
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          {editingMachine ? "Save Changes" : "Add Machine"}
        </Button>
      </Box>
    );
  }
  