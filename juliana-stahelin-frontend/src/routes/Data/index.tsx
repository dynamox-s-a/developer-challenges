import { useEffect, useState } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { getCharts } from '../../service/charts.ts'
import { SeriesData } from '../../types/charts.ts'
import { buildChartOptions } from '../../utils/charts.tsx'


export function Data() {
    const [data, setData] = useState<SeriesData[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getCharts()
                setData(res)
            } catch (e) {
                setError('Ocorreu um erro ao buscar os gráficos.')
            }
        }

        fetchData()
    }, [])

    const charts = [
        {
            title: 'Aceleração RMS',
            options: buildChartOptions(data!, 'Aceleração RMS (g)', 'accelerationRms')
        },
        {
            title: 'Temperatura',
            options: buildChartOptions(data!, 'Temperatura (ºC)', 'temperature')
        },
        {
            title: 'Velocidade RMS',
            options: buildChartOptions(data!, 'Aceleração (g)', 'velocityRms')
        }
    ]

    return (
        <main>
            <div>
                <h1>Análise de dados</h1>
            </div>
            <div>
                <span>Máquina 1023</span>
                <span>Ponto 20192</span>
                <span>200 RPM</span>
                <span>16g</span>
                <span>20 min</span>
            </div>
            <div>
                {error
                    ? <p>{error}</p>
                    : charts.map((item, index) => {
                        return (
                            <div key={item.title + index}>
                                <div>
                                    <h2>{item.title}</h2>
                                </div>
                                <HighchartsReact highcharts={Highcharts} options={item.options} />
                            </div>
                        )
                    })}
            </div>
        </main>
    )
}
