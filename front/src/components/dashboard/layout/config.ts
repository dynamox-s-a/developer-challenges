import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'assets', title: 'Assets', href: paths.dashboard.assets, icon: 'gear-six' },
  { key: 'sensors', title: 'Sensors', href: paths.dashboard.sensors, icon: 'chart' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
