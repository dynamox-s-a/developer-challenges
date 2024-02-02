import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import logo from "../assets/img/logo-dynapredict.png"
import { useTheme } from "@mui/material"

export const PageTitle = () => {
  const theme = useTheme()
  return (
    <Box
      bgcolor={theme.palette.primary.main}
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingY: "0.75em",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          color: "white",
          textAlign: "center",
        }}
      >
        Welcome to
      </Typography>
      <Box
        component="img"
        sx={{
          objectFit: "contain",
          height: { xs: 27, md: 37 },
        }}
        alt={`Dynapredict`}
        src={logo}
      />
    </Box>
  )
}
