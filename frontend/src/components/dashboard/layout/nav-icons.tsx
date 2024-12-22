import { PresentationChart } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Folder } from '@phosphor-icons/react/dist/ssr';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

/**
 * An object that maps icon names to their corresponding icon components.
 * @type {Record<string, Icon>}
 * @property {Icon} chart-pie - The icon component for a pie chart.
 * @property {Icon} presentation-chart - The icon component for a presentation chart.
 * @property {Icon} folder - The icon component for a folder.
 * @property {Icon} user - The icon component for a user.
 * @property {Icon} users - The icon component for multiple users.
 */
export const navIcons = {
  'chart-pie': ChartPieIcon,
  'presentation-chart': PresentationChart,
  'folder': Folder,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
