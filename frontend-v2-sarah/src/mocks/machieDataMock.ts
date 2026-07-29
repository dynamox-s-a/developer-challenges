import {
  DynamicRangeIcon,
  GpsIcon,
  MachineIcon,
  RpmIcon,
} from '../components/Icons';
import type { MachineData } from '../components/MachineSummaryBar/type';

export const mockMachineData: MachineData[] = [
  {
    id: 'machine',
    label: 'Máquina 1023',
    isLarge: true,
    icon: MachineIcon,
  },
  {
    id: 'point',
    label: 'Ponto 20192',
    isLarge: true,
    icon: GpsIcon,
  },
  {
    id: 'rpm',
    label: '200',
    isLarge: false,
    icon: RpmIcon,
  },
  {
    id: 'vibration',
    label: '16g',
    isLarge: false,
    icon: DynamicRangeIcon,
  },
  {
    id: 'time',
    label: '20 min',
    isLarge: false,
    icon: DynamicRangeIcon,
  },
];
