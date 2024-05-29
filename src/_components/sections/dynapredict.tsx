import { Box, Typography, Button } from "@mui/material";

export function DynapredictSection(){
  return(
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '24px', width: { md: '600px'}}}>
        <Typography sx={{ color: '#692742'}} variant="h4">Dynapredict</Typography>
        <Typography variant="subtitle2">
          Industry 4.0 solution for machine and comTypographyonent condition monitoring. The base for the DynaPredict Solution is a DynaLogger, a Bluetooth data logger with vibration and temperature sensors to monitor machine health and perform triaxial spectral analysis. The measured parameters are instantly displayed on the smartphone and its data history stored at the Web Platform for analysis and decision making. The DynaLogger data collection is automated by a gateway - the DynaGateway - developed by Dynamox.
        </Typography>
        <Button sx={{ width: { md: '150px'}}} variant="outlined">MORE</Button>
      </Box>
    </>
  )
}