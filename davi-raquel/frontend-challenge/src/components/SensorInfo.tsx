import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import { useAppSelector } from "../app/hooks"
import { selectSensor } from "../features/sensors/sensorSlice"

import sensorPic1 from "../assets/img/sensor-af.png"
import sensorPic2 from "../assets/img/sensor-hf.png"
import sensorPic3 from "../assets/img/sensor-tca.png"

export const SensorInfo = () => {
  const sensor = useAppSelector(selectSensor)
  const imgUrl =
    sensor.id === 3 ? sensorPic3 : sensor.id === 2 ? sensorPic2 : sensorPic1
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="img"
        sx={{
          objectFit: "cover",
          maxHeight: { xs: 100, md: 150 },
          maxWidth: { xs: 100, md: 150 },
          content: {
            xs: "none", //img src from xs up to md
            md: `url(${imgUrl})`, //img src from md and up
          },
        }}
        alt={`picture of ${sensor}`}
        // src={sensorPic}
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
