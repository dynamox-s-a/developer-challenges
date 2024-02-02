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
    <Box
      sx={{
        minWidth: 120,
        maxWidth: 240,
        display: "flex",
        color: "white",
        paddingY: "1em",
      }}
    >
      <Typography component="h3" sx={{ margin: "0.75em", textWrap: "nowrap" }}>
        Sensor:
      </Typography>
      <FormControl fullWidth>
        <InputLabel sx={{ color: "white" }} id="sensor-select-label">
          Sensor
        </InputLabel>
        <Select
          labelId="sensor-select-label"
          id="sensor-select"
          value={sensor.id || ""}
          label="Age"
          onChange={event => dispatch(getByIdAsync(Number(event.target.value)))}
          displayEmpty
          sx={{ minWidth: "150px", color: "white" }}
        >
          <MenuItem value="1">Sensor AF</MenuItem>
          <MenuItem value="2">Sensor HF</MenuItem>
          <MenuItem value="3">Sensor TCA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
