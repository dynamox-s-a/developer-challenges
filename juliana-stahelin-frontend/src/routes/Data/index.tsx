import { useEffect } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highchartsAccessibility from 'highcharts/modules/accessibility'
import { Box, Skeleton, Typography } from '@mui/material'

import { Duration, Location, Machine, Rounds, RPM } from '../../components/icons/index.tsx'
import { useAppDispatch, useAppSelector } from '../../hooks.ts'
import { buildChartOptions } from '../../utils/charts.tsx'


Highcharts.setOptions({
    lang: {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        weekdays: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    }
})

const fontColor = '#3A3B3F'
const borderColor = '#DFE3E8'
const backgroundColor = '#F8FAFC'

export function Data() {

    const dispatch = useAppDispatch()
    const { data, isLoading, error } = useAppSelector(state => state.charts)

    useEffect(() => {
        dispatch({ type: 'charts/getChartsFetch' })
    }, [dispatch])

    highchartsAccessibility(Highcharts)

    const machineInfo = [
        {
            title: 'Máquina 1023',
            icon: <Machine />
        },
        {
            title: 'Ponto 20192',
            icon: <Location />
        },
        {
            title: '200',
            icon: <RPM />
        },
        {
            title: '16g',
            icon: <Duration />
        },
        {
            title: '20min',
            icon: <Rounds />
        }
    ]

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
        <Box sx={{ backgroundColor: backgroundColor }}>
            <Box
                padding={{xs: '12px', sm: '24px' }}
                borderTop='1px solid'
                borderBottom='1px solid'
                borderRadius='4px'
                borderColor={borderColor}
            >
                <Typography variant='h6'>Análise de dados</Typography>
            </Box>
            <Box
                component='header'
                display='flex'
                flexWrap='wrap'
                justifyContent='space-evenly'
                rowGap={{xs: '5px', sm: '10px' }}
                margin={{xs: '12px', sm: '24px' }}
                padding='10px'
                color={fontColor}
                border='1px solid'
                borderColor={borderColor}
                sx={{ backgroundColor: '#fff' }}
            >
                {machineInfo.map((info, index) => (
                    <Box
                        component='span'
                        key={info.title + index}
                        display='flex'
                        flexGrow={1}
                        alignItems='center'
                        justifyContent='center'
                        gap={{xs: '5px', sm: '10px' }}
                        paddingRight='12px'
                        paddingLeft='12px'
                        borderRight='1px solid'
                        borderColor={borderColor}
                        sx={{
                            ':last-child': {
                                borderRight: 'none'
                            }
                        }}
                    >
                        {info.icon}
                        <Typography variant='body2'>{info.title}</Typography>
                    </Box>

                ))}
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                gap='24px'
                margin={{xs: '12px', sm: '24px' }}
                padding={{xs: '12px', sm: '24px' }}
                border='1px solid'
                borderColor={borderColor}
                sx={{ backgroundColor: '#fff' }}
            >
                {charts.map((item, index) => {
                    return (
                        <Box
                            key={item.title + index}
                            border='1px solid'
                            borderRadius='4px'
                            borderColor={borderColor}
                        >
                            <Box
                                border='1px solid'
                                borderColor={borderColor}
                                padding={{xs: '12px', sm: '24px' }}
                            >
                                <Typography variant='subtitle2'>{item.title}</Typography>
                            </Box>
                            <Box padding={{xs: '12px', sm: '24px' }}>
                                {isLoading
                                    ? <Skeleton variant='rectangular' width={'100%'} height={350} />
                                    : error
                                        ? <p>{error}</p>
                                        : <HighchartsReact highcharts={Highcharts} options={item.options} />
                                }
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}
