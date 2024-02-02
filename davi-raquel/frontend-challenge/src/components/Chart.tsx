import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

interface IChart extends React.HTMLAttributes<HTMLElement> {
  chartTitle: string
  chartData: any[]
  axis?: "x" | "y" | "z"
}

export const Chart = ({ chartTitle, chartData, ...props }: IChart) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          type: "spline",
        },
        title: {
          text: chartTitle,
          align: "left",
        },
        series: [
          {
            data: chartData,
          },
        ],
        xAxis: {
          crosshair: true,
          labels: {
            format: "{value} km",
          },
          accessibility: {
            description: "Kilometers",
            rangeDescription: "0km to 6.5km",
          },
        },
        tooltip: {
          positioner: function () {
            return {
              x: this.chart.chartWidth - this.label.width,
              y: 10,
            }
          },
        },
      }}
    />
  )
}

// {
//   chart: {
//       marginLeft: 40, // Keep all charts left aligned
//       spacingTop: 20,
//       spacingBottom: 20
//   },
//   title: {
//       text: dataset.name,
//       align: 'left',
//       margin: 0,
//       x: 30
//   },
//   credits: {
//       enabled: false
//   },
//   legend: {
//       enabled: false
//   },
//   xAxis: {
//       crosshair: true,
//       events: {
//           setExtremes: syncExtremes
//       },
//       labels: {
//           format: '{value} km'
//       },
//       accessibility: {
//           description: 'Kilometers',
//           rangeDescription: '0km to 6.5km'
//       }
//   },
//   yAxis: {
//       title: {
//           text: null
//       }
//   }
