import type { Meta, StoryObj } from "@storybook/nextjs";
import StatsChips from "./StatsChips";

const meta: Meta<typeof StatsChips> = {
  title: "UI/Display/StatsChips",
  component: StatsChips,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Chips de estatísticas mostrando informações sobre eventos.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalEvents: {
      control: { type: "number", min: 0, max: 500 },
      description: "Número total de eventos",
    },
    upcomingEvents: {
      control: { type: "number", min: 0, max: 500 },
      description: "Número de eventos próximos",
    },
    pastEvents: {
      control: { type: "number", min: 0, max: 500 },
      description: "Número de eventos passados",
    },
    filteredEvents: {
      control: { type: "number", min: 0, max: 500 },
      description: "Número de eventos filtrados",
    },
    hasFilters: {
      control: "boolean",
      description: "Exibir chip de eventos filtrados",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalEvents: 25,
    upcomingEvents: 15,
    pastEvents: 10,
    filteredEvents: 0,
    hasFilters: false,
  },
};

export const WithFilters: Story = {
  args: {
    totalEvents: 25,
    upcomingEvents: 15,
    pastEvents: 10,
    filteredEvents: 8,
    hasFilters: true,
  },
};

export const NoEvents: Story = {
  args: {
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    filteredEvents: 0,
    hasFilters: false,
  },
};

export const ManyEvents: Story = {
  args: {
    totalEvents: 150,
    upcomingEvents: 85,
    pastEvents: 65,
    filteredEvents: 23,
    hasFilters: true,
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <h4>Cenário Normal</h4>
        <StatsChips
          totalEvents={25}
          upcomingEvents={15}
          pastEvents={10}
          filteredEvents={0}
          hasFilters={false}
        />
      </div>
      <div>
        <h4>Com Filtros Aplicados</h4>
        <StatsChips
          totalEvents={25}
          upcomingEvents={15}
          pastEvents={10}
          filteredEvents={8}
          hasFilters={true}
        />
      </div>
      <div>
        <h4>Nenhum Evento</h4>
        <StatsChips
          totalEvents={0}
          upcomingEvents={0}
          pastEvents={0}
          filteredEvents={0}
          hasFilters={false}
        />
      </div>
      <div>
        <h4>Muitos Eventos</h4>
        <StatsChips
          totalEvents={500}
          upcomingEvents={320}
          pastEvents={180}
          filteredEvents={45}
          hasFilters={true}
        />
      </div>
    </div>
  ),
};
