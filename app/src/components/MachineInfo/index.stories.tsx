import type { Meta, StoryObj } from '@storybook/react-vite';
import Box from '@mui/material/Box';
import MachineInfo from './index';

const meta = {
  title: 'Components/MachineInfo',
  component: MachineInfo,
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 980 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof MachineInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
