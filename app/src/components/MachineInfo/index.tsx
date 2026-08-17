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
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        minHeight: { xs: 'auto', sm: 46 },
        justifyContent: 'space-between',
        p: 1,
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Info icon={<MachineIcon />} text="Máquina 1023" />
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }} />
      <Info icon={<LocationIcon />} text="Ponto 20192" />
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }} />
      <Info icon={<RpmIcon fontSize="small" />} text="200" />
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }} />
      <Info icon={<DurationIcon fontSize="small" />} text="16g" />
      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      <Divider sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }} />
      <Info icon={<IntervalIcon fontSize="small" />} text="20 min" />
    </Paper>
  );
}
