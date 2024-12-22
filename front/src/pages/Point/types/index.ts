import { SensorProps } from "../../Sensor/types"
import { InputErrorControlType } from "../../User/types"

export type PointProps = { 
  id?: number, 
  name?: string, 
  linkedMachine?: number, 
  totalSensors?: number 
}

export type PointContextType = {
  loading: boolean
  point: PointProps
  sensors: SensorProps[]
  nameError: InputErrorControlType
  openSnackbar: InputErrorControlType
  submitDisabled: boolean
  handleCloseSnackbar: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteSensor: (pointId: number) => void
}
