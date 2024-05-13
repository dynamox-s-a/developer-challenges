import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Container, Content } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectData } from "../../features/chartData/chartDataSlice";
import { AppDispatch } from "../../store";

export interface DataItem {
  datetime: string;
  max: number;
}

interface DynamicChartProps {
  chartId: string;
  urls: string[];
  seriesNames: string[];
  title: string;
  titleAxisX: string;
  lineColors?: string[];
}

const DynamicChart: React.FC<DynamicChartProps> = ({
  chartId,
  urls,
  seriesNames,
  title,
  titleAxisX,
  lineColors = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const series = useSelector(selectData(chartId));

  useEffect(() => {
    dispatch(fetchData(chartId, urls, seriesNames, lineColors));
  }, [dispatch, chartId, urls, seriesNames, lineColors]);

  const chartOptions: Highcharts.Options = {
    title: {
      text: title,
    },
    xAxis: {
      type: "datetime",
      title: {
        text: titleAxisX,
      },
    },
    yAxis: {
      title: {
        text: titleAxisX,
      },
    },
    series: JSON.parse(JSON.stringify(series)),
    tooltip: {
      dateTimeLabelFormats: {
        day: "%A, %d de %B de %Y",
        weekday: "%A",
        hour: "%H:%M",
      },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <Container>
      <Content>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Content>
    </Container>
  );
};

export default DynamicChart;
