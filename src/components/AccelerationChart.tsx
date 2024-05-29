import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { fetchAccelerationRequest } from '../redux/slices/accelerationSlice';
import { RootState } from '../redux/store';
import { PointData } from '../types';

function AccelerationChart() {
  const dispatch = useDispatch();
  const { xData, yData, zData, loading, error } = useSelector((state: RootState) => state.acceleration);

  useEffect(() => {
    dispatch(fetchAccelerationRequest());
  }, [dispatch]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const isDataLoaded = xData.length > 0 && yData.length > 0 && zData.length > 0;

  if (!isDataLoaded) {
    return <div>Sem dados para exibir.</div>;
  }

  const options = {
    title: {
      text: '',
    },
    series: [
      {
        name: 'X Axis',
        data: xData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
      {
        name: 'Y Axis',
        data: yData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
      {
        name: 'Z Axis',
        data: zData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
    ],
  };

  return <div>{options && <HighchartsReact highcharts={Highcharts} options={options} />}</div>;
}
export default AccelerationChart;
