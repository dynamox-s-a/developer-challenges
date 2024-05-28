import { Box, Typography } from "@mui/material";
import { TemperatureChart } from "../charts/temperature-chart";
import { TemperatureSelect } from "../charts/temperature-select";

import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

export function TemperatureChartCard(){
  return (
    <>
      <Box sx={{ borderRadius:'16px', padding: {xs: '24px 16px', md:'48px'}, boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)'}}>
      <Typography sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px', paddingBottom: { xs: '24px', md: '32px' }, fontWeight: '600', fontSize: { xs: '1rem', md: '1.5rem' } }}>
        <Box sx={{ display: "flex", alignItems: 'center', gap: '4'}}>
          <DeviceThermostatIcon /> 
          <p>Temperature</p>
        </Box>
        <TemperatureSelect />
      </Typography>
      <TemperatureChart />
    </Box>
    </>
  )
}