import type { Meta, StoryObj } from '@storybook/react';
import Header from '../components/Header';
import { ThemeContextProvider } from '../context/ThemeContext';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeContextProvider>
        <Story />
      </ThemeContextProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header do dashboard exibindo o título "Análise de Dados" e informações da máquina (Máquina, Ponto, RPM, Peso, Duração).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};