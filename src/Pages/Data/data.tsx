import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Helmet } from "react-helmet-async";
import { Container, Typography } from "@mui/material";
import { MachineCardsContainer } from "./data.styles";
import { MachineCards } from "../../_components/machineCards/machine-cards";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEffect } from "react";
import { getMeasuresFetch } from "../../store/slices/measuresSlice";
import { Measure } from '../../@types/types';

interface MeasuresOptionHighchartFormatted {
  name: string;
  data: number[][];
}

export function Data() {
  const measures: Measure[] = useAppSelector(store => store.measures.data);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMeasuresFetch());
  }, [dispatch]);

  // Função para processar os dados do JSON para o formato do Highcharts
  function processChartData(measures: Measure[], metricName: string){
    const metricData = measures.find(metric => metric.name.includes(metricName));

    if (!metricData) return [];

    const metricDataNewDateFormatted = metricData.data.map(entry => [new Date(entry.datetime).getTime(), entry.max]);

    return metricDataNewDateFormatted
  }

  const accelerationData = ['accelerationRms/x', 'accelerationRms/y', 'accelerationRms/z'].map(metric => ({
    name: metric,
    data: processChartData(measures, metric),
  }));

  console.log('accelerationData', accelerationData)

  const velocityData = ['velocityRms/x', 'velocityRms/y', 'velocityRms/z'].map(metric => ({
    name: metric,
    data: processChartData(measures, metric),
  }));

  const temperatureData = [{
    name: 'temperature',
    data: processChartData(measures, 'temperature'),
  }];

  function createChartOptions(title: string, series: MeasuresOptionHighchartFormatted[]) {
    return {
      title: { text: title },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Magnitude' } },
      series: series
    };
  }

  const accelerationOptions = createChartOptions('Aceleração RMS', accelerationData);
  const velocityOptions = createChartOptions('Velocidade RMS', velocityData);
  const temperatureOptions = createChartOptions('Temperatura', temperatureData);

  return (
    <>
      <Helmet title="Data" />
      <Container sx={{ display: "flex", flexDirection: 'column', gap: '16px', padding: { xs: '24px', md: '80px' } }}>
        <Typography sx={{ paddingBottom: { xs: '8px', md: '16px' }, fontWeight: '600', fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
          Análise de dados
        </Typography>
        <MachineCardsContainer>
          <MachineCards />
        </MachineCardsContainer>

        <HighchartsReact highcharts={Highcharts} options={accelerationOptions} />
        <HighchartsReact highcharts={Highcharts} options={velocityOptions} />
        <HighchartsReact highcharts={Highcharts} options={temperatureOptions} />
      </Container>
    </>
  );
}
