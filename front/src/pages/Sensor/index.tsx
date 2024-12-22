import { SensorContextProvider } from './context'
import { SensorCard } from './SensorCard'

export const Sensor = () => {
  return (
    <SensorContextProvider>
      <SensorCard />
    </SensorContextProvider>
  )
}
