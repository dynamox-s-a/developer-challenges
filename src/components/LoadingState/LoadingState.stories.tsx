import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingState } from './index';

const meta = {
	component: LoadingState,
	tags: ['autodocs'],
	title: 'Components/States/LoadingState',
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
	args: {
		message: 'Preparando análise...',
	},
};
