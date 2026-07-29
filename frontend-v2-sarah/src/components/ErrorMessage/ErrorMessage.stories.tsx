import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorMessage } from './index';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Texto exibido na mensagem de erro',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    message:
      'Não foi possível buscar as métricas dos sensores. Por favor, tente novamente mais tarde.',
  },
};
