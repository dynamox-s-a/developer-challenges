import type { Meta, StoryObj } from "@storybook/react";
import { EventGrid } from "./EventGrid";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme/theme";
import { EventModel } from "@/dto/EventModelDto";

const mockEvents: EventModel[] = [
  {
    id: 1,
    title: "Workshop React Avançado",
    date: "2025-12-10",
    time: "09:00",
    location: "Florianópolis, SC",
    category: "workshop",
    description:
      "Um workshop completo sobre padrões avançados de React, otimização de hooks e práticas modernas de arquitetura front-end.",
  },
  {
    id: 2,
    title: "Conferência de Tecnologia 2025",
    date: "2025-11-20",
    time: "10:00",
    location: "São Paulo, SP",
    category: "conferencia",
    description:
      "Evento que reúne profissionais de TI para discutir tendências em IA, Cloud e desenvolvimento escalável.",
  },
  {
    id: 3,
    title: "Happy Hour de Networking",
    date: "2025-12-01",
    time: "18:30",
    location: "Porto Alegre, RS",
    category: "networking",
    description:
      "Momento de descontração e troca de contatos entre profissionais da área de tecnologia e inovação.",
  },
  {
    id: 4,
    title: "Webinar sobre React Query",
    date: "2025-11-28",
    time: "20:00",
    location: "Online",
    category: "webinar",
    description:
      "Aprenda como otimizar suas requisições com React Query e padrões modernos de cache de dados.",
  },
] as const;

const meta: Meta<typeof EventGrid> = {
  title: "Components/EventGrid",
  component: EventGrid,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    faded: {
      control: "boolean",
      description: "Define se os cards aparecem com opacidade reduzida (ex: eventos passados).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventGrid>;

export const LightMode: Story = {
  args: {
    events: mockEvents,
    faded: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    events: mockEvents,
    faded: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const Faded: Story = {
  args: {
    events: mockEvents,
    faded: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};
