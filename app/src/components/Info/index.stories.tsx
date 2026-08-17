import type { Meta, StoryObj } from '@storybook/react-vite';
import Info from './index';
import MachineIcon from '../icons/Machine';

const meta = {
  title: 'Components/Info',
  component: Info,
  args: {
    icon: <MachineIcon />,
    text: 'Máquina 1023',
  },
} satisfies Meta<typeof Info>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    text: 'Máquina 1023 - Unidade Industrial Norte',
  },
};
