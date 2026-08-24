import type { Meta, StoryObj } from '@storybook/react-vite';
import { MACHINE_INFO } from '@/features/measurements/constants';
import { MachineSummary } from './index';

const meta = {
	args: {
		data: MACHINE_INFO,
	},
	component: MachineSummary,
	tags: ['autodocs'],
	title: 'Measurements/MachineSummary',
} satisfies Meta<typeof MachineSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {};

export const Partial: Story = {
	args: {
		data: {
			machineId: '1023',
			range: '16g',
			rpm: 0,
		},
	},
	globals: {
		viewport: { isRotated: false, value: 'mobile' },
	},
};
