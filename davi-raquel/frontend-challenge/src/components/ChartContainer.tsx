import Box from "@mui/material/Box"
import { Chart } from "./Chart"
import { useAppSelector } from "../app/hooks"
import { selectAxis } from "../features/axis/axisSlice"

export const ChartContainer = () => {
  const data = [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
  const axis = useAppSelector(selectAxis)
  return (
    <Box sx={{ border: 1 }}>
      <Chart chartTitle={`Acceleration ${axis}`} axis={axis} chartData={data} />
      <Chart chartTitle={`Velocity ${axis}`} axis={axis} chartData={data} />
      <Chart chartTitle="Temperature" chartData={data} />
    </Box>
  )
}
