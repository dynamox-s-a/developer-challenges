import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'machine', title: 'Machine', href: paths.dashboard.machine, icon: 'machine' },
  { key: 'monitoring-points', title: 'Monitoring Points', href: '/dashboard/monitoring-points', icon: 'plugs-connected' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
