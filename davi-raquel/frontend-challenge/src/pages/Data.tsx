import { useEffect } from "react"
import Box from "@mui/material/Box"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getByIdAsync, selectStatus } from "../features/sensors/sensorSlice"

import { PageContainer } from "../components/PageContainer"
import { SensorSelector } from "../components/SensorSelector"
import { ChartContainer } from "../components/ChartContainer"
import { SensorInfo } from "../components/SensorInfo"
import { ToggleAxis } from "../components/ToggleAxis"

export const Data = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  useEffect(() => {
    dispatch(getByIdAsync(1))
  }, [dispatch])
  return (
    <PageContainer>
      <SensorSelector />
      {status === "idle" && (
        <Box>
          <SensorInfo />
          <ToggleAxis />
          <ChartContainer />
        </Box>
      )}
    </PageContainer>
  )
}
