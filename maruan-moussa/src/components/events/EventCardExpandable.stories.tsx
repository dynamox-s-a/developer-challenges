import type { Meta, StoryObj } from "@storybook/react";
import EventCardExpandable from "./EventCardExpandable";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme/theme";
import { useState } from "react";

const mockEvent = {
    id: 1,
    title: "Workshop React Avançado",
    date: "2025-12-10",
    time: "09:00",
    location: "Florianópolis, SC",
    category: "workshop",
    description:
      "Um workshop completo sobre padrões avançados de React, otimização de hooks e práticas modernas de arquitetura front-end.",
  } as const;

const meta: Meta<typeof EventCardExpandable> = {
  title: "Components/EventCardExpandable",
  component: EventCardExpandable,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    faded: {
      control: "boolean",
      description: "Define se o card deve aparecer levemente opaco (usado em eventos passados).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventCardExpandable>;

export const LightMode: Story = {
  render: (args) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <EventCardExpandable
          {...args}
          event={mockEvent}
          expandedId={expandedId}
          onToggle={setExpandedId}
        />
      </ThemeProvider>
    );
  },
};

export const DarkMode: Story = {
  render: (args) => {
    const [expandedId, setExpandedId] = useState<string | null>("1");

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <EventCardExpandable
          {...args}
          event={mockEvent}
          expandedId={expandedId}
          onToggle={setExpandedId}
        />
      </ThemeProvider>
    );
  },
};
