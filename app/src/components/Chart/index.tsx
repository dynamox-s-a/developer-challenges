import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

type ChartProps = {
  title: string;
  series: Highcharts.SeriesOptionsType[];
  xAxisTitle: string;
};

const chartConfig: Highcharts.Options = {
  title: {
    text: '',
  },
  chart: {
    type: 'line',
    spacingBottom: 15,
    spacingTop: 25,
    spacingLeft: 20,
    spacingRight: 20,
    plotBorderWidth: 1,
    plotBorderColor: '#E5E7EB',
  },
  xAxis: {
    type: 'datetime',
    tickInterval: 4 * 24 * 3600 * 1000,
    gridLineWidth: 1,
    gridLineColor: '#E5E7EB',
    crosshair: {
      width: 1,
      color: '#9CA3AF',
      dashStyle: 'Dash',
    },
  },
  yAxis: {
    gridLineWidth: 1,
    gridLineColor: '#E5E7EB',
  },
  palette: {
    colorScheme: 'light',
  },
  tooltip: {
    xDateFormat: '%d/%m/%Y %H:%M:%S',
    shared: true,
  },
};

export default function Chart({ title, series, xAxisTitle }: ChartProps) {
  const theme = useTheme();

  return (
    <Paper variant="outlined">
      <Typography variant="body2" sx={{ p: 2, color: theme.palette.primary.main, fontWeight: 500 }}>
        {title}
      </Typography>
      <Divider />
      {series.length > 0 && (
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            ...chartConfig,
            xAxis: {
              ...(chartConfig.xAxis as Highcharts.XAxisOptions),
              title: { text: xAxisTitle },
            },
            series,
          }}
        />
      )}
    </Paper>
  );
}
