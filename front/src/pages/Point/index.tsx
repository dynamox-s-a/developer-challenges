import { PointContextProvider } from './context'
import { PointCard } from './PointCard'

export const Point = () => {
  return (
    <PointContextProvider>
      <PointCard />
    </PointContextProvider>
  )
}
