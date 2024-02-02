import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import { useAppSelector } from "../app/hooks"
import { selectSensor } from "../features/sensors/sensorSlice"

import sensorPic from "../assets/img/sensor-af.png"

export const SensorInfo = () => {
  const sensor = useAppSelector(selectSensor)

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="img"
        sx={{
          objectFit: "cover",
          maxHeight: { xs: 100, md: 150 },
          maxWidth: { xs: 100, md: 150 },
        }}
        alt={`picture of ${sensor}`}
        src={sensorPic}
      />
      <Box sx={{ color: "white" }}>
        <Typography component="h4">Title: {sensor.title}</Typography>
        <Typography sx={{ maxWidth: { xs: "90vw", md: "40vw" } }}>
          Description: {sensor.description}
        </Typography>
      </Box>
    </Box>
  )
}
