import { SelectChangeEvent } from "@mui/material"
import { InputErrorControlType } from "../../User/types"

export type SensorProps = { 
  id?: number, 
  model?: string
}

export type SensorContextType = {
  loading: boolean
  sensor: SensorProps
  modelError: InputErrorControlType
  openSnackbar: InputErrorControlType
  submitDisabled: boolean
  handleCloseSnackbar: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleSensorModelChange: (e: SelectChangeEvent<string>) => void
}
