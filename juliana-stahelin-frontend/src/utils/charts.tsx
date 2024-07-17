import { DataPoint, SeriesData, SeriesName, SingleSeries, VibrationAxis } from '../types/charts'


export function getSeriesData(data: SeriesData[], chartType: string): SeriesData[] {
    if (!data || !data.length) return []
    return data.filter(series => series.name.includes(chartType))
}

const getSeriesInfo = (name: SeriesName) => {
    const lastChars = name.substring(name.length - 2)
    const isAxis = lastChars[0] === '/'

    if (isAxis) return VibrationAxis[lastChars as keyof typeof VibrationAxis]
    return SingleSeries[name as keyof typeof SingleSeries]
}

export function buildChartOptions(
    data: SeriesData[],
    yAxisTitle: string,
    chartType: string
): Highcharts.Options {

    const seriesData = getSeriesData(data, chartType)
    const formattedSeries = seriesData.map(series => ({
        name: getSeriesInfo(series.name as SeriesName).title,
        data: series.data.map(point => [new Date(point.datetime).getTime(), point.max]),
        type: 'line' as const,
        color: getSeriesInfo(series.name as SeriesName).color
    }))
    const options: Highcharts.Options = {
        title: {
            text: undefined
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            title: {
                text: yAxisTitle
            },
        },
        chart: {
            style: {
                cursor: 'crosshair'
            }
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            labels: {
                                align: 'right',
                                x: 0,
                                y: 0
                            },
                            title: {
                                text: '',
                            }
                        }
                    }
                }
            ]
        },
        series: formattedSeries,
    }
    return options
}

function isDataPoint(data: any): data is DataPoint {
    return (
        typeof data.datetime == 'string' &&
        typeof data.max == 'number'
    )
}

function isSeriesData(data: any): data is SeriesData {
    return (
        typeof data.name == 'string' &&
        Array.isArray(data.data) && data.data.every(isDataPoint)
    )
}

export function isSeriesDataArray(data: any): data is SeriesData[] {
    return (
        Array.isArray(data) &&
        data.every(isSeriesData)
    )
}
