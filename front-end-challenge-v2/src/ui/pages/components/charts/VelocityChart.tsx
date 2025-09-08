import { PreparedSeries } from "@/domain/data/types";
import Highcharts from "highcharts";
import BaseTimeseriesChart from "./BaseTimeseriesChart";

type Props = {
  series: PreparedSeries[];
  onReady?: (c: Highcharts.Chart) => void;
  xMin?: number;
  xMax?: number;
};

export default function VelocityChart({ series, onReady, xMin, xMax }: Props) {
  return (
    <BaseTimeseriesChart
      title="Velocidade (RMS)"
      yTitle="mm/s (aprox)"
      series={series}
      onReady={onReady}
      xMin={xMin}
      xMax={xMax}
    />
  );
}
