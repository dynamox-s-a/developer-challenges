import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'registerMachines', title: 'Register Machines', href: paths.dashboard.registerMachines, icon: 'chart-pie' },
  { key: 'registerMonitoringPoints', title: 'Register Monitoring Points', href: paths.dashboard.registerMonitoringPoints, icon: 'chart-pie' },
  { key: 'monitoringPoints', title: 'List Monitoring Points', href: paths.dashboard.listMonitoringPoints, icon: 'chart-pie' },
  { key: 'machines', title: 'List Machines', href: paths.dashboard.listMachines, icon: 'chart-pie' },
] satisfies NavItemConfig[];
