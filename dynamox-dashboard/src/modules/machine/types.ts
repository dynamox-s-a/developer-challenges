export interface IMachineInfo {
  id: string
  point: string
  rotation: string
  range: string
  interval: string
}

export interface IMachineState {
  data: IMachineInfo | null
  error: string | null
  isLoading: boolean
}
