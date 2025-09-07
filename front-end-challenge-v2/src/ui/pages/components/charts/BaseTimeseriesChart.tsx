import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { PreparedSeries } from "@/domain/data/types";

type Props = {
  title: string;
  yTitle: string;
  series: PreparedSeries[];
  onReady?: (chart: Highcharts.Chart) => void;
  decimals?: number;
  xMin?: number;
  xMax?: number;
  // opcionais; o grupo agora faz a sincronização global
  onHoverX?: (x: number) => void;
  onLeave?: () => void;
};

const BaseTimeseriesChart: React.FC<Props> = ({
  title,
  yTitle,
  series,
  onReady,
  decimals = 3,
  xMin,
  xMax,
}) => {
  const first = series[0];

  const options = useMemo<Highcharts.Options>(
    () => ({
      title: { text: title },
      xAxis: {
        type: "datetime",
        crosshair: {
          enabled: true,
          snap: false,
          width: 1,
          color: "#888",
          dashStyle: "ShortDot",
        },
        min: xMin,
        max: xMax,
      },
      yAxis: { title: { text: yTitle } },
      series: first
        ? [{ type: "line", name: first.id, data: first.points }]
        : [],
      legend: { enabled: false },
      credits: { enabled: false },
      tooltip: { shared: false, valueDecimals: decimals },
    }),
    [title, yTitle, first, decimals, xMin, xMax]
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      callback={onReady}
      oneToOne
      allowChartUpdate
    />
  );
};

export default BaseTimeseriesChart;
