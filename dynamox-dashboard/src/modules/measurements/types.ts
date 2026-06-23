export interface IMeasurementPoint {
  datetime: string
  max: number
}

export interface IMeasurementSeries {
  name: string
  data: IMeasurementPoint[]
}

export interface IMeasurementsState {
  data: IMeasurementSeries[]
  error: string | null
  isLoading: boolean
}
