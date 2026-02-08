import {
  ChartPie as ChartPieIcon,
  Engine as EngineIcon,
  GearSix as GearSixIcon,
  PlugsConnected as PlugsConnectedIcon,
  User as UserIcon,
  Users as UsersIcon,
  XSquare,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  machine: EngineIcon,
} as Record<string, Icon>;
