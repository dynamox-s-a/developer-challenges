import type { Meta, StoryObj } from '@storybook/react-vite';
import Header from './index';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Análise de Dados',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTitle: Story = {
  args: {
    title: 'Dashboard Operacional',
  },
};
