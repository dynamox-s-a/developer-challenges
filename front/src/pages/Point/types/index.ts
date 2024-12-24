import { SensorProps } from "../../Sensor/types"
import { InputErrorControlType } from "../../User/types"

export type PointProps = { 
  id?: number
  name?: string
  machine_id?: number
  totalSensors?: number 
}

export interface PointWithSensors extends PointProps {
  sensors: SensorProps[]
  machine_type: string
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
  onDeletePoint: () => void
  onDeleteSensor: (pointId: number) => void
}
