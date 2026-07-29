import type { ElementType } from 'react';

export interface MachineData {
  id: string;
  label: string;
  isLarge: boolean;
  icon: ElementType<{ size?: number }>;
}
