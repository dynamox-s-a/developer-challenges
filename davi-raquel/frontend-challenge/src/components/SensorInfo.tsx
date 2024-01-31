import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import sensorPic from "../assets/img/sensor-af.png"
interface ISensorInfo extends React.HTMLAttributes<HTMLSelectElement> {
  sensor: string
}

export const SensorInfo = ({ sensor }: ISensorInfo) => {
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
      <Box>
        <Typography component="h4">Title {sensor}</Typography>
        <Typography>Description {sensor}</Typography>
      </Box>
    </Box>
  )
}
