import Box from "@mui/material/Box"
import { Chart } from "./Chart"

interface IChartContainer extends React.HTMLAttributes<HTMLElement> {
  axis: string
}

export const ChartContainer = ({ axis, ...props }: IChartContainer) => {
  return (
    <Box sx={{ border: 1 }}>
      <Chart title={`acceleration ${axis}`} />
      <Chart title={`velocity ${axis}`} />
      <Chart title="temperature" />
    </Box>
  )
}
