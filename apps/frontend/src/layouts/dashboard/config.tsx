import { SvgIcon } from '@mui/material';
import Wrench from '@heroicons/react/24/solid/WrenchIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import CpuChip from '@heroicons/react/24/solid/CpuChipIcon';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Sensors',
    path: '/sensors',
    icon: (
      <SvgIcon fontSize="small">
        <CpuChip />
      </SvgIcon>
    )
  },
  {
    title: 'Machines',
    path: '/machienes',
    icon: (
      <SvgIcon fontSize="small">
        <Wrench />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
];
