import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { fetchAccelerationRequest } from '../../redux/slices/accelerationSlice';
import { RootState } from '../../redux/store';
import { PointData } from '../../types';

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
        name: 'Axial',
        color: '#2386CB',
        lineColor: '#2386CB',
        data: xData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
      {
        name: 'Horizontal',
        color: '#CC337D',
        lineColor: '#CC337D',
        data: yData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
      {
        name: 'Radial',
        color: '#B48A00',
        lineColor: '#B48A00',
        data: zData.map((point: PointData) => [new Date(point.datetime).getTime(), point.max]),
      },
    ],
  };

  return (
    <div className="highcard-container">{options && <HighchartsReact highcharts={Highcharts} options={options} />}</div>
  );
}
export default AccelerationChart;
