import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { formatChartData } from '../../../utils/formatChartData';
import { RootState } from '../../../interfaces/types';
import { commonChartOptions } from '../../../utils/commonChartOptions';

const TemperatureChart: React.FC = () => {
  const { data, loading } = useSelector((state: RootState) => ({
    data: state.data,
    loading: state.loading,
  }));

  if (loading) return <div>Carregando...</div>;

  const temperatureData = data?.temperature;

  const series: SeriesLineOptions[] = temperatureData
    ? [
        {
          name: 'Temperatura',
          type: 'line',
          data: formatChartData(temperatureData.data),
        },
      ]
    : [];

  const options = commonChartOptions('', 'Temperatura (°C)', series);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TemperatureChart;
