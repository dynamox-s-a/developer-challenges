import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'machines', title: 'Machines', href: paths.dashboard.machines, icon: 'gear-fine' },
  { key: 'monitoring-points', title: 'Monitoring Points', href: paths.dashboard.monitoring_points, icon: 'pulse' },
] satisfies NavItemConfig[];
