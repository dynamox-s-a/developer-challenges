import { MachineProps, PointsProps } from "../../Machine/types"

export type HomeContextType = {
  loading: boolean
  points: PointsProps[]
  machines: MachineProps[]
  onEditMachine: (machineId?: number) => void
  onDeleteMachine: (machineId?: number) => void
  onEditPoint: (pointId?: number) => void
  onDeletePoint: (pointId?: number) => void
}


