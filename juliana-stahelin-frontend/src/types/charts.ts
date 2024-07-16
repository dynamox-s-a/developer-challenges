export interface DataPoint {
    datetime: string
    max: number
}

export interface SeriesData {
    name: string
    data: DataPoint[]
}

export const SingleSeries = {
    temperature: 'Temperatura'
} as const

export type SingleSeries = keyof typeof SingleSeries

export const VibrationAxis = {
    '/x': 'Horizontal',
    '/y': 'Axial',
    '/z': 'Radial',
} as const

export type SeriesName = `${string}${'/x' | '/y' | '/z'}` | SingleSeries
