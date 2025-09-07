import { PreparedSeries } from "@/domain/data/types";
import Highcharts from "highcharts";
import BaseTimeseriesChart from "./BaseTimeseriesChart";

type Props = {
  series: PreparedSeries[];
  onReady?: (c: Highcharts.Chart) => void;
  xMin?: number;
  xMax?: number;
  onHoverX?: (x: number) => void;
  onLeave?: () => void;
};

export default function AccelerationChart({
  series,
  onReady,
  xMin,
  xMax,
  onHoverX,
  onLeave,
}: Props) {
  return (
    <BaseTimeseriesChart
      title="Aceleração (RMS)"
      yTitle="g (aprox)"
      series={series}
      onReady={onReady}
      xMin={xMin}
      xMax={xMax}
      onHoverX={onHoverX}
      onLeave={onLeave}
    />
  );
}
