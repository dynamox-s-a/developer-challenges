export interface SensorData {
  id: number
  title: string
  description: string
  info: MockResponse[]
}

export interface MockResponse {
  name: string
  data: RawData[]
}

export interface RawData {
  datetime: string
  max: string
}
