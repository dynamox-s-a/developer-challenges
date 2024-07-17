export interface DataPoint {
    datetime: string
    max: number
}

export interface SeriesData {
    name: string
    data: DataPoint[]
}

export const SingleSeries = {
    temperature: {
        title: 'Temperatura',
        color: '#89982E'
}
} as const

export type SingleSeries = keyof typeof SingleSeries

export const VibrationAxis = {
    '/x': {
        title: 'Horizontal',
        color: '#CC337D'
    },
    '/y': {
        title: 'Axial',
        color: '#2386CB'
    },
    '/z': {
        title: 'Radial',
        color: '#B48A00'
    },
} as const

export type SeriesName = `${string}${'/x' | '/y' | '/z'}` | SingleSeries
