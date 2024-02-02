import Box from "@mui/material/Box"
import { Chart } from "./Chart"
import { useAppSelector } from "../app/hooks"
import { selectAxis } from "../features/axis/axisSlice"
import { selectSensor } from "../features/sensors/sensorSlice"

export const ChartContainer = () => {
  const axis = useAppSelector(selectAxis)
  const sensorData = useAppSelector(selectSensor).info

  const filterByMetric = (metric: string) => {
    const metricResult = sensorData.filter(item => {
      if (metric === "temp" && item.name.toLowerCase().includes(metric)) {
        return true
      }
      if (
        item.name.toLowerCase().includes(metric) &&
        item.name.toLowerCase().includes(axis)
      ) {
        return true
      }
      return false
    })
    const result = metricResult[0].data.map(item => [
      new Date(item.datetime).getTime(),
      item.max,
    ])
    return result
  }

  return (
    <Box
      sx={{
        padding: "1em",
      }}
    >
      <Chart
        chartTitle={`Acceleration ${axis}`}
        axis={axis}
        chartData={filterByMetric("acc")}
      />
      <Chart
        chartTitle={`Velocity ${axis}`}
        axis={axis}
        chartData={filterByMetric("vel")}
      />
      <Chart chartTitle="Temperature" chartData={filterByMetric("temp")} />
    </Box>
  )
}
