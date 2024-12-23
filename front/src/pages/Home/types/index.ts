import { MachineProps } from "../../Machine/types"
import { PointProps } from "../../Point/types"
import { InputErrorControlType } from "../../User/types"

export type HomeContextType = {
  loading: boolean
  points: PointProps[]
  machines: MachineProps[]
  openSnackbar: InputErrorControlType
  onEditMachine: (machineId?: number) => void
  onDeleteMachine: (machineId?: number) => void
  onEditPoint: (pointId?: number) => void
  onDeletePoint: (pointId?: number) => void
  handleCloseSnackbar: () => void
}


