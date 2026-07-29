import type { ElementType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DynamicRangeIcon, MachineIcon } from '../Icons';
import { MachineSummaryItem } from './index';

const meta: Meta<typeof MachineSummaryItem> = {
  title: 'Components/MachineSummaryItem',
  component: MachineSummaryItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MachineSummaryItem>;

export const Default: Story = {
  args: {
    data: {
      id: '1',
      label: '200',
      isLarge: false,
      icon: null as unknown as ElementType<{ size?: number | undefined }>,
    },
  },
  render: (args) => {
    const dataWithIcon = {
      ...args.data,
      icon: DynamicRangeIcon,
    };

    return <MachineSummaryItem data={dataWithIcon} />;
  },
};

export const IsLarge: Story = {
  args: {
    data: {
      id: '2',
      label: 'Máquina 1023',
      isLarge: true,
      icon: null as unknown as ElementType<{ size?: number | undefined }>,
    },
  },

  render: (args) => {
    const dataWithIcon = {
      ...args.data,
      icon: MachineIcon,
    };

    return <MachineSummaryItem data={dataWithIcon} />;
  },
};
