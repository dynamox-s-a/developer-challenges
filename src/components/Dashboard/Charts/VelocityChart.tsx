import Highcharts, { SeriesLineOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';
import { formatChartData } from '../../../utils/formatChartData';
import { RootState } from '../../../interfaces/types';
import { commonChartOptions } from '../../../utils/commonChartOptions';

const VelocityChart: React.FC = () => {
  const { data, loading } = useSelector((state: RootState) => ({
    data: state.data,
    loading: state.loading,
  }));

  if (loading) return <div>Carregando...</div>;

  const velocityData = data?.velocity;

  const series: SeriesLineOptions[] = velocityData
    ? [
        {
          name: 'Axial',
          type: 'line',
          data: formatChartData(velocityData.x.data),
        },
        {
          name: 'Horizontal',
          type: 'line',
          data: formatChartData(velocityData.y.data),
        },
        {
          name: 'Radial',
          type: 'line',
          data: formatChartData(velocityData.z?.data || []),
        },
      ]
    : [];

  const options = commonChartOptions('', 'Velocidade RMS (mm/s)', series);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default VelocityChart;
