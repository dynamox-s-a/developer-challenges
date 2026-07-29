import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './index';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    pageTitle: {
      control: 'text',
      description: 'Título exibido no cabeçalho da página',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    pageTitle: 'Análise de dados',
  },
};

export const LongTitle: Story = {
  args: {
    pageTitle: 'Dashboard - Relatório detalhado de desempenho e indicadores',
  },
};
