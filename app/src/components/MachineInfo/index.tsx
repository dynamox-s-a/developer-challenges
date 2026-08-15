import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MachineIcon from '../icons/Machine';
import LocationIcon from '../icons/Location';
import RpmIcon from '../icons/Rpm';
import DurationIcon from '../icons/Duration';
import IntervalIcon from '../icons/Interval';
import Info from '../Info';

export default function MachineInfo() {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 46,
        justifyContent: 'space-between',
        p: 1,
      }}
    >
      <Info icon={<MachineIcon />} text="Máquina 1023" />
      <Divider orientation="vertical" flexItem />
      <Info icon={<LocationIcon />} text="Ponto 20192" />
      <Divider orientation="vertical" flexItem />
      <Info icon={<RpmIcon fontSize="small" />} text="200" />
      <Divider orientation="vertical" flexItem />
      <Info icon={<DurationIcon fontSize="small" />} text="16g" />
      <Divider orientation="vertical" flexItem />
      <Info icon={<IntervalIcon fontSize="small" />} text="20 min" />
    </Paper>
  );
}
