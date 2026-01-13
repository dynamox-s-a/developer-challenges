import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'machines', title: 'Machines', href: paths.dashboard.machines, icon: 'gear-six' },
  { key: 'monitors', title: 'Monitoring Points', href: paths.dashboard.monitoring, icon: 'plugs-connected' },
] satisfies NavItemConfig[];
