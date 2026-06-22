export interface IMeasurementPoint {
  datetime: string
  max: number
}

export interface IMeasurementSeries {
  name: string
  data: IMeasurementPoint[]
}

export interface IMachineInfo {
  name: string
  point: string
  rotation: string
  range: string
  interval: string
}

export interface IMeasurementsPayload {
  machine: IMachineInfo
  measurements: IMeasurementSeries[]
}

export interface IMeasurementsState {
  data: IMeasurementSeries[]
  error: string | null
  isLoading: boolean
  machine: IMachineInfo | null
}
