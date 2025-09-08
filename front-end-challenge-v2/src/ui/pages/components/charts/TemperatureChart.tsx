import { PreparedSeries } from "@/domain/data/types";
import Highcharts from "highcharts";
import BaseTimeseriesChart from "./BaseTimeseriesChart";

type Props = {
  series: PreparedSeries[];
  onReady?: (c: Highcharts.Chart) => void;
  xMin?: number;
  xMax?: number;
};

export default function TemperatureChart({
  series,
  onReady,
  xMin,
  xMax,
}: Props) {
  return (
    <BaseTimeseriesChart
      title="Temperatura"
      yTitle="°C"
      series={series}
      onReady={onReady}
      xMin={xMin}
      xMax={xMax}
    />
  );
}
