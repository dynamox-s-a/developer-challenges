import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import BoltIcon from '@mui/icons-material/Bolt';

export const MACHINE_COLORS = ['#69263c', '#a93d61'];
export const SENSOR_COLORS = ['#69263c', '#a93d61', '#a47584'];
export const SENSOR_LABEL_MAP: Record<string, string> = { HFPlus: 'HF+' };

export const METRICS = [
  {
    key: 'temperature',
    label: 'Temperatura',
    unit: '°C',
    color: '#e53935',
    Icon: DeviceThermostatIcon,
  },
  { key: 'velocityRms', label: 'Velocidade RMS', unit: 'mm/s', color: '#039be5', Icon: SpeedIcon },
  { key: 'accelerationRms', label: 'Aceleração RMS', unit: 'g', color: '#8e24aa', Icon: BoltIcon },
] as const;

export type MetricKey = (typeof METRICS)[number]['key'];
