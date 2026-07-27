import type { MachineData } from './type';
import { Divider, Stack } from '@mui/material';
import { MachineSummaryItem } from '../MachineSummaryItem';
import { MachineSummaryBarContainer } from './style';

export const MachineSummaryBar = ({
  machineData,
}: {
  machineData: MachineData[];
}) => {
  return (
    <MachineSummaryBarContainer>
      <Stack
        direction={{ sm: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="space-around"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={{ xs: 1.5, sm: 2.5 }}
        sx={{
          width: '100%',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {machineData.map((data) => (
          <MachineSummaryItem key={data.id} {...{ data }} />
        ))}
      </Stack>
    </MachineSummaryBarContainer>
  );
};
