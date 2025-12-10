import { Box, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EventTabPanel, EventTabs } from "./EventTabs";

const meta: Meta<typeof EventTabs> = {
  title: "Events/EventTabs",
  component: EventTabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    value: "upcoming",
    onChange: fn(),
    upcomingCount: 5,
    pastCount: 3,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UpcomingSelected: Story = {
  args: {
    value: "upcoming",
    upcomingCount: 5,
    pastCount: 3,
  },
};

export const PastSelected: Story = {
  args: {
    value: "past",
    upcomingCount: 5,
    pastCount: 3,
  },
};

export const ManyEvents: Story = {
  args: {
    value: "upcoming",
    upcomingCount: 99,
    pastCount: 150,
  },
};

export const NoUpcomingEvents: Story = {
  args: {
    value: "past",
    upcomingCount: 0,
    pastCount: 10,
  },
};

export const NoPastEvents: Story = {
  args: {
    value: "upcoming",
    upcomingCount: 8,
    pastCount: 0,
  },
};

export const NoEvents: Story = {
  args: {
    value: "upcoming",
    upcomingCount: 0,
    pastCount: 0,
  },
};

// Story showing tabs with tab panels
export const WithTabPanels: Story = {
  args: {
    value: "upcoming",
    upcomingCount: 3,
    pastCount: 2,
  },
  render: (args) => (
    <Box>
      <EventTabs {...args} />
      <EventTabPanel value="upcoming" currentValue={args.value}>
        <Typography>Upcoming events content goes here</Typography>
      </EventTabPanel>
      <EventTabPanel value="past" currentValue={args.value}>
        <Typography>Past events content goes here</Typography>
      </EventTabPanel>
    </Box>
  ),
};
