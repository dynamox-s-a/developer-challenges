import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './index';
import { Box } from '@mui/material';

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box display="flex" height="300px" width="100%">
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};
