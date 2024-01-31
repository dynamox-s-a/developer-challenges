import { useState } from "react"
import Box from "@mui/material/Box"
import type { SelectChangeEvent } from "@mui/material/Select"

import { PageContainer } from "../components/PageContainer"
import { SensorSelector } from "../components/SensorSelector"
import { ChartContainer } from "../components/ChartContainer"
import { SensorInfo } from "../components/SensorInfo"
import { ToggleAxis } from "../components/ToggleAxis"

interface IData extends React.HTMLAttributes<HTMLDivElement> {}

export const Data = ({ ...props }: IData) => {
  const [sensor, setSensor] = useState("")
  const [axis, setAxis] = useState("x")

  const handleChangeSensor = (event: SelectChangeEvent) => {
    setSensor(event.target.value as string)
  }

  const handleChangeAxis = (
    event: React.MouseEvent<HTMLElement>,
    newAxis: string,
  ) => {
    setAxis(newAxis)
  }

  return (
    <PageContainer>
      <Box>
        <SensorSelector sensor={sensor} handleChange={handleChangeSensor} />
        <SensorInfo sensor={sensor} />
      </Box>
      <ToggleAxis axis={axis} handleChange={handleChangeAxis} />
      <ChartContainer axis={axis} />
    </PageContainer>
  )
}
