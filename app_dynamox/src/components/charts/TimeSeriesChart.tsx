import Highcharts from 'highcharts';
import HighchartsReactImport from 'highcharts-react-official';
import type { ChartGroup } from '../../features/telemetry/telemetry.transform';
import { Box } from '@mui/material';

const HighchartsReact = (HighchartsReactImport as any).default ?? HighchartsReactImport;

type Props = {
    group: ChartGroup;
};

function toHighchartsPoints(series: ChartGroup['series'][number]): Highcharts.SeriesLineOptions {
    const axis = series.name.split('/')[1];

    const labels = { x: 'Axial', y: 'Horizontal', z: 'Radial' };

    const name = axis ? labels[axis as keyof typeof labels] : 'Temperatura';

    return {
        type: 'line',
        name,
        data: series.data.map((point) => [
            new Date(point.datetime).getTime(),
            point.max,
        ]),
    };
}

const TimeSeriesChart = ({ group }: Props) => {
    const options: Highcharts.Options = {
        colors: ['#7CB5EC', '#E91E8C', '#B8860B'],
        chart: {
            backgroundColor: '#ffffff',
            plotBorderWidth: 1,
            plotBorderColor: '#DFE3E8',
            style: {
                fontFamily: 'Roboto, sans-serif',
            },
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            lineColor: '#DFE3E8',
            tickColor: '#DFE3E8',
            labels: {
                style: { color: '#31539c', fontSize: '14px' },
            },
            crosshair: true,
        },
        yAxis: {
            title: {
                text: group.unit,
                style: { color: '#31539c', fontSize: '14px' },
            },
            gridLineColor: '#f0f0f0',
            labels: {
                style: { color: '#31539c', fontSize: '14px' },
            },
        },
        legend: {
            enabled: true,
            itemStyle: {
                color: '#424242',
                fontWeight: '600',
                fontSize: '14px',
            },
        },
        tooltip: {
            backgroundColor: '#ffffff',
            borderColor: '#DFE3E8',
            borderRadius: 4,
            style: { color: '#212121', fontSize: '12px' },
            shared: true,
            xDateFormat: '%d/%m/%Y %H:%M',
        },
        plotOptions: {
            line: {
                lineWidth: 1.5,
                marker: { enabled: false },
            },
        },
        series: group.series.map(toHighchartsPoints),
        credits: {
            enabled: false,
        },
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'light1',
                    borderRadius: '0.5rem 0.5rem 0 0',
                    color: 'dark',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    padding: '1.5rem',
                }}
            >
                {group.title}
            </Box>
            <Box
                sx={{
                    border: '1px solid',
                    borderTop: 0,
                    borderColor: 'light1',
                    borderRadius: '0 0 0.5rem 0.5rem',
                    padding: '1.5rem 2rem'
                }}
            >
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
        </Box>
    );
};

export default TimeSeriesChart;
