import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './index';

const meta = {
	component: EmptyState,
	tags: ['autodocs'],
	title: 'Components/States/EmptyState',
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
	args: {
		message: 'Nenhum dado encontrado para o período selecionado.',
	},
};
