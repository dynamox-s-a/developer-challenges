import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styles from "../Styles/Chart.module.css";
import { colors, labels } from "../Consts";
import { IFlowchartState, IDataPoint } from "../Types/Flowchart";

interface IChart {
  title: string;
  data: IFlowchartState[];
  yAxisTitle: string;
}

const Chart: React.FC<IChart> = ({ title, data, yAxisTitle }) => {

  const seriesData = data.map((item, index) => {
    return {
      name: labels[index],
      data: item?.data?.map((point: IDataPoint) => [new Date(point.datetime).getTime(), point.max * 100]),
      color: colors[index],
    };
  });

  const chartOptions = {
    chart: {
      type: "line",
    },
    title: {
      text: '',
    },
    xAxis: {
      type: "datetime",
      crosshair: true,
    },
    yAxis: {
      title: {
        text: yAxisTitle,
      },
    },
    series: seriesData,
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.chart}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default Chart;
