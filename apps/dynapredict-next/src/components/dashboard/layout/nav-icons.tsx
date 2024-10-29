import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearFine as GearFineIcon } from '@phosphor-icons/react/dist/ssr/GearFine';
import { Pulse as PulseIcon } from '@phosphor-icons/react/dist/ssr/Pulse';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-fine': GearFineIcon,
  pulse: PulseIcon,
} as Record<string, Icon>;
