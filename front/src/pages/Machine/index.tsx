import { MachineContextProvider } from './context'
import { MachineCard } from './MachineCard'

export const Machine = () => {
  return (
    <MachineContextProvider>
      <MachineCard />
    </MachineContextProvider>
  )
}
