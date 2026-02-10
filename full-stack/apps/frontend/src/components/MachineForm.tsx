import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { Machine, MachineType } from "../api/machines";

type MachineFormProps = {
  data: Partial<Machine>;
  onChange: (data: Partial<Machine>) => void;
  disabled?: boolean;
};

export function MachineForm({ data, onChange, disabled = false }: MachineFormProps) {
  return (
    <>
      <TextField
        label="Name"
        value={data.name || ""}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        disabled={disabled}
        fullWidth
        required
      />
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Type</InputLabel>
        <Select
          value={data.type || "Pump"}
          label="Type"
          onChange={(e) => onChange({ ...data, type: e.target.value as MachineType })}
        >
          <MenuItem value="Pump">Pump</MenuItem>
          <MenuItem value="Fan">Fan</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
