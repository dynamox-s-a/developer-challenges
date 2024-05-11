import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios, { AxiosResponse } from "axios";
import { Container, Content } from "./styles";

interface DataItem {
  datetime: string;
  max: number;
}

interface DynamicChartProps {
  urls: string[];
  seriesNames: string[];
  title: string;
  titleAxisX: string;
  lineColors?: string[];
}

const DynamicChart: React.FC<DynamicChartProps> = ({
  urls,
  seriesNames,
  title,
  titleAxisX,
  lineColors = [],
}) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    series: [],
  });

  useEffect(() => {
    const fetchData = (
      url: string,
      seriesName: string,
      color: string | undefined
    ): Promise<Highcharts.SeriesOptionsType> => {
      return axios
        .get(url)
        .then((response: AxiosResponse<{ data: DataItem[] }>) => {
          const { data } = response.data;
          const formattedData = data.map((item: DataItem) => ({
            x: new Date(item.datetime).getTime(),
            y: item.max,
          }));
          return {
            type: "line",
            name: seriesName,
            data: formattedData,
            color: color,
          };
        });
    };

    Promise.all(
      urls.map((url, index) =>
        fetchData(url, seriesNames[index], lineColors[index])
      )
    ).then((responses: Highcharts.SeriesOptionsType[]) => {
      const options: Highcharts.Options = {
        title: {
          text: title,
        },
        xAxis: {
          type: "datetime",
          title: {
            text: "Data e Hora",
          },
        },
        yAxis: {
          title: {
            text: titleAxisX,
          },
        },
        series: responses,
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
      setChartOptions(options);
    });
  }, [urls, seriesNames, lineColors]);

  return (
    <Container>
      <Content>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Content>
    </Container>
  );
};

export default DynamicChart;
