export interface RawData {
  datetime: string
  max: number
}

export interface ApiResponseBySensor {
  id: number
  name: string
  title: string
  description: string
  info: { name: string; data: RawData[] }[]
}
