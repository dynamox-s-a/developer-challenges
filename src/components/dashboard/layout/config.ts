import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'machines', title: 'Machines', href: paths.dashboard.machines, icon: 'HardDrive' },
  { key: 'sensors', title: 'Monitoring Points', href: paths.dashboard.account, icon: 'Broadcast' }
] satisfies NavItemConfig[];
