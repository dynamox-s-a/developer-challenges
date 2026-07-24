import Typography from '@mui/material/Typography';
import { MachineDataContainer } from './style';

export const MachineData = ({
  machineInfoTitle,
}: {
  machineInfoTitle: string;
}) => {
  return (
    <MachineDataContainer>
      <Typography variant="h6">{machineInfoTitle}</Typography>
    </MachineDataContainer>
  );
};
