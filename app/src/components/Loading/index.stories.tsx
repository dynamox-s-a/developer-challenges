import type { Meta, StoryObj } from '@storybook/react-vite';
import Loading from './index';

const meta = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
