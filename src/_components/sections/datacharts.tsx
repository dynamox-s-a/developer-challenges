import { Typography, Box, Skeleton, Stack } from "@mui/material"
import { useAppSelector } from "../../store"
import { AccelerationCardChart } from "../chartCards/accelerationchart-card"
import { VelocityChartCard } from "../chartCards/velocitychart-card";
import { TemperatureChartCard } from "../chartCards/temperaturechart-card";

export function DataChartsSection(){
  const isChartLoading = useAppSelector(store => store.measures.isLoading)

  return(
    <Box>
      {/* Data Charts section */}
      <Typography sx={{ color: '#692746', paddingTop: { xs: '40px', md: '72px' }, paddingBottom: '16px', fontWeight: '600', fontSize: { xs: '1.25rem', md: '2.25rem' } }}>
        Data Charts
      </Typography>
      {isChartLoading ? (
          <Stack spacing={6}>
            <Skeleton variant="rounded" height={500} />
            <Skeleton variant="rounded" height={500} />
            <Skeleton variant="rounded" height={500} />
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: {xs: '32px', md: '64px'}}}>
            <AccelerationCardChart />  
            <VelocityChartCard />
            <TemperatureChartCard />
          </Box>
        )}
    </Box>
  )
}