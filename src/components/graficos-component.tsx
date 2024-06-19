import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { formatDate, formatDateShort } from '../utils/formate-date';
import React from 'react';

interface GraphProps {
    data: any[];
    seriesLabels: string[];
}

/** 
 * @param 
 *  data valores enviados pelo componente pai
 *  seriesLabels nomes que serão separados para as legendas
 * @returns 
 *  retorna dos graficos separados para cada lista de dado enviado
 */
const GraficosComponent: React.FC<GraphProps> = ({ 
    data, seriesLabels }) => {

    /**
     * Lista quais cores das linhas dos graficos
     */
    const getSeriesColor = (label: string) => {
        if (label.endsWith('x')) return '#4184cd';
        if (label.endsWith('y')) return '#bd407c';
        if (label.endsWith('z')) return '#ae8c00';
        if (label.endsWith('temperature')) return '#8c9827'
        return 'black';
    };

    /**
     * Troca o titulo das legendas
     */
    const getSeriesTitle = (label: string) => {
        if (label.includes('accelerationRms')) {
            if (label.endsWith('x')) return 'Axial';
            if (label.endsWith('y')) return 'Horizontal';
            if (label.endsWith('z')) return 'Radial';
        }
        if (label.includes('velocityRms')) {
            if (label.endsWith('x')) return 'Axial';
            if (label.endsWith('y')) return 'Horizontal';
            if (label.endsWith('z')) return 'Radial';
        }
        if (label.endsWith('temperature')) {
            return 'Temperatura';
        }
        return label;
    };

    /**
     * Configuração para o gráfico
     * Responsavel por montar os gráficos separando os dados retirando marcações
     * formatando datas para eixo x
     */
    const lineChartsParams: LineChartProps = {
        series: seriesLabels.map((label, index) => ({
        label: getSeriesTitle(label),
        data: data[index].data.map((d: any) => d.max),
        showMark: false,
        color: getSeriesColor(label),
        })),
        height: 400,        
        xAxis: [{ 
            data: data[0].data.map((d: any) => new Date(d.datetime)), 
            scaleType: 'time',
            valueFormatter: (date) => formatDateShort(new Date(date)),   
            hideTooltip: true
        }]
    };

    return (
        <LineChart
            {...lineChartsParams}
            series={lineChartsParams.series.map((series) => ({
                ...series,
                valueFormatter: (_, { dataIndex }) => {
                    const xAxisData = lineChartsParams.xAxis?.[0]?.data;
                    const seriesData = series.data ? series.data[dataIndex] : '';
                    return xAxisData ? `${formatDate(xAxisData[dataIndex])} - ${seriesData}` : '';
                },
            }))}
        />
    );
};

export default GraficosComponent;