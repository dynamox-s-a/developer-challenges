export interface RawData {
  datetime: string
  max: string
}

export interface ApiResponseBySensor {
  id: number
  name: string
  title: string
  description: string
  data: RawData[]
}
