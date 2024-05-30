import { Box, Typography } from "@mui/material";
import { MachineCards } from "../machineCards/machine-cards";

export function MachineInformationSection(){

  return(
    <Box>
      <Typography sx={{ color: '#692746', paddingTop: { xs: '8px', md: '40px' }, paddingBottom: '16px', fontWeight: '600', fontSize: { xs: '1.25rem', md: '2.25rem' } }}>
        Machine Information
      </Typography>
      
      <MachineCards />
    </Box>
  )
}