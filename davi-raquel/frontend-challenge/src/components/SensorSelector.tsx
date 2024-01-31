import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import type { SelectChangeEvent } from "@mui/material/Select"

interface ISensorSelector extends React.HTMLAttributes<HTMLSelectElement> {
  sensor: string
  handleChange: (event: SelectChangeEvent) => void
}

export const SensorSelector = ({
  sensor,
  handleChange,
  ...props
}: ISensorSelector) => {
  return (
    <Box sx={{ minWidth: 120, maxWidth: 240 }}>
      <Typography component="h2">Choose the Sensor:</Typography>
      <FormControl fullWidth>
        <InputLabel id="sensor-select-label">Sensor</InputLabel>
        <Select
          labelId="sensor-select-label"
          id="sensor-select"
          value={sensor}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="sensor1">Sensor 1</MenuItem>
          <MenuItem value="sensor2">Sensor 2</MenuItem>
          <MenuItem value="sensor3">Sensor 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
