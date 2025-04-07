import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createMachine } from "../store/machines/machineThunks";
import { Button, TextField, MenuItem, Box, Typography, Paper } from "@mui/material";

const MachineForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [type, setType] = useState<"Pump" | "Fan">("Pump");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(createMachine({ name, type }))
      .unwrap()
      .then(() => {
        setName("");
        setType("Pump");
      })
      .catch((err) => {
        console.error("Erro ao criar máquina:", err);
      });
  };

  return (
    <Paper sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Nova Máquina
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" gap={2}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField
          label="Tipo"
          select
          value={type}
          onChange={(e) => setType(e.target.value as "Pump" | "Fan")}
          required
        >
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">
          Adicionar
        </Button>
      </Box>
    </Paper>
  );
};

export default MachineForm;
