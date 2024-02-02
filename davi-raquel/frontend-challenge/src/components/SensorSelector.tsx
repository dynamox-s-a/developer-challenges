import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getByIdAsync, selectSensor } from "../features/sensors/sensorSlice"

export const SensorSelector = () => {
  const sensor = useAppSelector(selectSensor)
  const dispatch = useAppDispatch()
  return (
    <Box sx={{ minWidth: 120, maxWidth: 240 }}>
      <Typography component="h3">Change Sensor:</Typography>
      <FormControl fullWidth>
        <InputLabel id="sensor-select-label">Sensor</InputLabel>
        <Select
          labelId="sensor-select-label"
          id="sensor-select"
          value={sensor.id || ""}
          label="Age"
          onChange={event => dispatch(getByIdAsync(Number(event.target.value)))}
          displayEmpty
        >
          <MenuItem value="1">Sensor 1</MenuItem>
          <MenuItem value="2">Sensor 2</MenuItem>
          <MenuItem value="3">Sensor 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
