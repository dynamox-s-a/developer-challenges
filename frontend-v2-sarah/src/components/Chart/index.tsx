import Typography from '@mui/material/Typography';
import type { ChartData } from '../../features/data/types';
import { ChartContainer } from './style';

export const Chart = ({ data }: { data: ChartData }) => {
  const { chartTitle, unit, series, yAxisTitle } = data;

  return (
    <ChartContainer>
      <Typography variant="h6">{chartTitle}</Typography>
      {/*Aqui você usa 'chartTitle', 'unit' e faz o .map() em 'series' para
      desenhar as linhas e cores!*/}
    </ChartContainer>
  );
};
