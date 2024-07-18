import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesLineOptions } from "highcharts";
import { RootState } from "../../../interfaces/types";
import { fetchDataRequest } from "../../../redux/actions";
import { formatChartData } from "../../../utils/formatChartData";
import { commonChartOptions } from "../../../utils/commonChartOptions";

const AccelerationChart = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state: RootState) => ({
    data: state.data,
    loading: state.loading,
  }));

  useEffect(() => {
    dispatch(fetchDataRequest());
  }, [dispatch]);

  if (loading) return <div>Carregando...</div>;

  const accelerationData = data?.acceleration;

  const series: SeriesLineOptions[] = accelerationData
    ? [
        {
          name: "Axial",
          type: "line",
          data: formatChartData(accelerationData.x.data),
        },
        {
          name: "Horizontal",
          type: "line",
          data: formatChartData(accelerationData.y.data),
        },
        {
          name: "Radial",
          type: "line",
          data: formatChartData(accelerationData.z?.data || []),
        },
      ]
    : [];

  const options = commonChartOptions("", "Aceleração RMS (g)", series);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default AccelerationChart;
