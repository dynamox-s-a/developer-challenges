export type Point = { datetime: string; max: number }
export type Series = { name: string; data: Point[] }

export type PreparedPoint = [number, number]
export type PreparedSeries = { id: string; points: PreparedPoint[] }

export interface DataState {
  loading: boolean
  error: string | null
  acceleration: PreparedSeries[]
  velocity: PreparedSeries[]
  temperature: PreparedSeries[]
}
