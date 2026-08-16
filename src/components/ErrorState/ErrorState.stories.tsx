import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ErrorState } from './index';

const meta = {
	component: ErrorState,
	tags: ['autodocs'],
	title: 'Components/States/ErrorState',
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
	args: {
		message: 'Não foi possível consultar as medições.',
	},
};

export const WithRetry: Story = {
	args: {
		onRetry: fn(),
	},
};
