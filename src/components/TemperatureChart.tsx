import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { fetchTemperatureRequest } from '../redux/slices/temperatureSlice';
import { RootState } from '../redux/store';
import { PointData } from '../types';

function TemperatureChart() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.temperature);

  useEffect(() => {
    dispatch(fetchTemperatureRequest());
  }, [dispatch]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const options = {
    title: {
      text: '',
    },
    series: [
      {
        name: 'Temperatura',
        data: data.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
    ],
  };

  return <div>{options && <HighchartsReact highcharts={Highcharts} options={options} />}</div>;
}

export default TemperatureChart;
