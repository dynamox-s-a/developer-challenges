import type { ElementType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DynamicRangeIcon,
  GpsIcon,
  IntervalIcon,
  MachineIcon,
  RpmIcon,
} from '../Icons';
import { MachineSummaryBar } from './index';

const meta: Meta<typeof MachineSummaryBar> = {
  title: 'Components/MachineSummaryBar',
  component: MachineSummaryBar,
  tags: ['autodocs'],
  argTypes: {
    machineData: {
      control: 'object',
      description:
        'Array de objetos com os dados dos itens. Cada item possui: `id` (string), `label` (string), `isLarge` (boolean) e `icon` (Componente React do ícone).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MachineSummaryBar>;

type IconType = ElementType<{ size?: number | undefined }>;
const icon = null as unknown as IconType;
const iconsList = [
  MachineIcon,
  GpsIcon,
  RpmIcon,
  IntervalIcon,
  DynamicRangeIcon,
];

export const Default: Story = {
  args: {
    machineData: [
      { id: '1', label: 'Item 1', isLarge: true, icon },
      { id: '2', label: 'Item 2', isLarge: true, icon },
      { id: '3', label: 'Item 3', isLarge: false, icon },
      { id: '4', label: 'Item 4', isLarge: false, icon },
      { id: '5', label: 'Item 5', isLarge: false, icon },
    ],
  },
  render: (args) => {
    const machineDataWithIcons = args.machineData.map((item, index) => ({
      ...item,
      icon: iconsList[index] || icon,
    }));

    return <MachineSummaryBar machineData={machineDataWithIcons} />;
  },
};
