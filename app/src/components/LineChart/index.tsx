import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TChart } from '../../common/types';
import { Skeleton } from '@mui/material';

export default function LineChart({
  lines,
  status,
  title,
  yAxisTitle,
}: TChart) {
  const series: Array<{ data: Array<number>; name?: string }> = [];

  lines.forEach(element => {
    series.push({
      data: element.series,
      name: element.axisName,
    });
  });

  const options = {
    chart: {
      borderColor: '#dfe3e8',
      borderRadius: 4,
      borderWidth: 1,
      plotBorderWidth: 1,
    },
    title: {
      text: title,
      align: 'left',
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
    },
    xAxis: {
      type: 'datetime',
      categories: lines.length > 0 ? lines[0].range : [],
    },
    plotOptions: {
      series: {
        cursor: 'crosshair',
      },
    },

    series: series,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  };

  if (status === 'loading') {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
