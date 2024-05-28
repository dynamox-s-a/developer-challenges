import { Typography, Box } from "@mui/material"
import { useAppSelector } from "../../store"
import { AccelerationCardChart } from "../chartCards/accelerationchart-card"
import { VelocityChartCard } from "../chartCards/velocitychart-card";
import { TemperatureChartCard } from "../chartCards/temperaturechart-card";

export function DataChartsSection(){
  const isChartLoading = useAppSelector(store => store.measures.isLoading)

  return(
    <>
      {/* Data Charts section */}
      {isChartLoading ? (
          <div>Charts Information loading...</div>
        ) : (
          <>
            <Typography sx={{ color: '#692746', paddingTop: { xs: '40px', md: '72px' }, paddingBottom: { xs: '8px', md: '8px' }, fontWeight: '600', fontSize: { xs: '1.25rem', md: '2.25rem' } }}>
              Data Charts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '72px'}}>
              <AccelerationCardChart />  
              <VelocityChartCard />
              <TemperatureChartCard />
  
            </Box>
          </>
        )}
    </>
  )
}