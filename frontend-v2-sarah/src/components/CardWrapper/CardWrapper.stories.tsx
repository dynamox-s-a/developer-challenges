import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardWrapper } from './index';
import { Typography } from '@mui/material';

const meta: Meta<typeof CardWrapper> = {
  title: 'Components/CardWrapper',
  component: CardWrapper,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título exibido no cabeçalho',
    },
    children: {
      control: false,
      description: 'Conteúdo interno renderizado dentro do card',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardWrapper>;

export const Default: Story = {
  args: {
    title: 'Resumo de Métricas',
    children: (
      <Typography variant="body2">
        Este é o conteúdo interno do card. Pode ser qualquer elemento React.
      </Typography>
    ),
  },
};
