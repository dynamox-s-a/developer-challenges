import { memo, useMemo } from "react";
import type { ChartSeries } from "../../features/data/types";
import { buildChartOptions } from "../../features/utils/chartOptions";
import Highcharts from "highcharts";
import "highcharts/modules/accessibility";
import { HighchartsReact } from "highcharts-react-official";

type TimeSeriesChartProps = {
  series: ChartSeries[];
  yAxisTitle: string;
  valueDecimals?: number;
};

function TimeSeriesChart(props: TimeSeriesChartProps) {
  const { series, yAxisTitle, valueDecimals } = props;
  const options = useMemo(
    () => buildChartOptions(series, yAxisTitle, valueDecimals),
    [series, yAxisTitle, valueDecimals],
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default memo(TimeSeriesChart);
