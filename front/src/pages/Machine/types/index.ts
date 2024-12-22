import { SelectChangeEvent } from "@mui/material"
import { InputErrorControlType } from "../../User/types"
import { PointProps } from "../../Point/types"

export type MachineProps = { 
  id?: number, 
  name?: string, 
  type?: string, 
  totalPoints?: number, 
  totalSensors?: number 
}

export type MachineContextType = {
  loading: boolean
  machine: MachineProps
  points: PointProps[]
  nameError: InputErrorControlType
  machineTypeError: InputErrorControlType
  openSnackbar: InputErrorControlType
  submitDisabled: boolean
  handleCloseSnackbar: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleMachineTypeChange: (e: SelectChangeEvent<string>) => void
  onEditPoint: (pointId: number) => void
  onDeletePoint: (pointId: number) => void
}
