import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface IChart extends React.HTMLAttributes<HTMLElement> {
  chartTitle: string
  chartData: any[]
  axis?: "x" | "y" | "z"
}

export const Chart = ({ chartTitle, chartData, ...props }: IChart) => {
  Highcharts.Pointer.prototype.reset = function () {
    return undefined
  }
  const baseString = chartTitle.toLowerCase()
  const [units, decimals] = baseString.includes("acc")
    ? ["m/s²", 3]
    : baseString.includes("vel")
      ? ["m/s", 3]
      : ["ºC", 2]

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        chart: {
          scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1,
          },
          type: "spline",
        },
        title: {
          text: chartTitle,
          align: "left",
        },
        series: [
          {
            name: `${chartTitle}`,
            data: chartData,
          },
        ],
        xAxis: {
          crosshair: true,
          accessibility: {
            description: "Data",
            rangeDescription: "",
          },
          labels: {
            format: "{value:%Y-%m-%d %H:%M:%S}",
          },
          type: "datetime",
        },
        tooltip: {
          positioner: function () {
            return {
              x: this.chart.chartWidth - this.label.width - 20,
              y: 0,
            }
          },
          valueDecimals: decimals,
          borderWidth: 0,
          backgroundColor: "none",
          pointFormat: `{point.y} ${units}`,
          shadow: false,
          style: {
            fontSize: "18px",
          },
        },
      }}
    />
  )
}
