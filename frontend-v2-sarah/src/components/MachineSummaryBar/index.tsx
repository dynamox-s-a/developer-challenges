import type { MachineData } from './type';
import {
  MachineSummaryBarContainer,
  MachineSummaryBarDataLabel,
} from './style';
import { Divider, Stack } from '@mui/material';

export const MachineSummaryBar = ({
  machineData,
}: {
  machineData: MachineData[];
}) => {
  return (
    <MachineSummaryBarContainer>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="space-around"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={{ xs: 1.5, sm: 2.5 }}
        sx={{
          width: '100%',
          overflowX: 'auto',
          // Esconde a barra de rolagem mantendo a funcionalidade responsiva
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {machineData.map((data, index) => (
          <MachineSummaryBarDataLabel
            key={data.id}
            isPrimary={index < 2}
            component="span"
          >
            {data.label}
          </MachineSummaryBarDataLabel>
        ))}
      </Stack>
    </MachineSummaryBarContainer>
  );
};
