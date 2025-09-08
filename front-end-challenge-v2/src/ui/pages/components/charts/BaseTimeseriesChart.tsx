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
};

function axisOf(id: string): "x" | "y" | "z" | null {
  const lower = id.toLowerCase();
  if (lower.endsWith("/x")) return "x";
  if (lower.endsWith("/y")) return "y";
  if (lower.endsWith("/z")) return "z";
  return null;
}

function prettySeriesName(id: string): string {
  const lower = id.toLowerCase();
  const axis = axisOf(id);
  const axisLabel = axis ? axis.toUpperCase() : "";

  if (lower.includes("acceleration"))
    return axis ? `Aceleração ${axisLabel}` : "Aceleração";
  if (lower.includes("velocity"))
    return axis ? `Velocidade ${axisLabel}` : "Velocidade";
  if (lower.includes("temperature")) return "Temperatura";
  return id;
}

const BaseTimeseriesChart: React.FC<Props> = ({
  title,
  yTitle,
  series,
  onReady,
  decimals = 3,
  xMin,
  xMax,
}) => {
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
        labels: {
          formatter: function () {
            const v = (this as unknown as { value: number }).value;
            return new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
            }).format(new Date(v));
          },
        },
      },
      yAxis: { title: { text: yTitle } },

      series: series.map((s) => ({
        type: "line" as const,
        name: prettySeriesName(s.id),
        data: s.points,
        marker: { enabled: false },
        turboThreshold: 0,
      })),

      legend: { enabled: true },
      credits: { enabled: false },

      tooltip: {
        shared: true,
        valueDecimals: decimals,
        useHTML: true,
        formatter: function () {
          const x = (this as unknown as { x?: number }).x ?? Date.now();
          const when = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(x));

          const pts =
            (
              this as unknown as {
                points?: Array<{ series: { name: string }; y: number | null }>;
              }
            ).points ?? [];

          const lines = pts
            .map((p) => {
              const name = p.series.name;
              const val =
                typeof p.y === "number"
                  ? p.y.toFixed(decimals)
                  : String(p.y ?? "");
              return `${name}: ${val}`;
            })
            .join("<br/>");

          return `<strong>${when}</strong><br/>${lines}`;
        },
      },
    }),
    [title, yTitle, series, decimals, xMin, xMax]
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
