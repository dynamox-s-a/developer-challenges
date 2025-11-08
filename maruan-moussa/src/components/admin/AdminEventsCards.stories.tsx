import type { Meta, StoryObj } from "@storybook/react";
import { AdminEventsCards } from "./AdminEventsCards";
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
] as const;

const handleEdit = (event: EventModel) => {
  console.log("Editar evento:", event);
};
const handleDelete = (event: EventModel) => {
  console.log("Excluir evento:", event);
};

const meta: Meta<typeof AdminEventsCards> = {
  title: "Components/AdminEventsCards",
  component: AdminEventsCards,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
O componente **AdminEventsCards** substitui a listagem tradicional em tabela
por um layout em **cards empilháveis e responsivos**.

### 🧭 Decisão de design
- Em telas **mobile**, as tabelas perdem legibilidade e exigem rolagem horizontal.
- O uso de **cards** permite adaptação fluida e mantém consistência visual com o restante do sistema.
- Cada card agrupa título, data, local, categoria e ações administrativas (editar/excluir).
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminEventsCards>;

// ☀️ Tema Claro
export const LightMode: Story = {
  args: {
    events: mockEvents,
    onEdit: handleEdit,
    onDelete: handleDelete,
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
    onEdit: handleEdit,
    onDelete: handleDelete,
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

export const EmptyState: Story = {
  args: {
    events: [],
    onEdit: handleEdit,
    onDelete: handleDelete,
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
