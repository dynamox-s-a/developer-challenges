import Highcharts from "highcharts"

interface IChart extends React.HTMLAttributes<HTMLElement> {
  title: string
}

export const Chart = ({ title, ...props }: IChart) => {
  return (
    <div>
      <h3>{title}</h3>
      GRÁFICO
    </div>
  )
}
