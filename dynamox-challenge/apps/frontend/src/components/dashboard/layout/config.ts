import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'machine', title: 'Machines', href: paths.machine.list, icon: 'machine' },
  { key: 'monitoring-points', title: 'Monitoring Points', href: paths.monitoringPoints, icon: 'plugs-connected' },
  { key: 'account', title: 'Account', href: paths.account, icon: 'user' },
] satisfies NavItemConfig[];
