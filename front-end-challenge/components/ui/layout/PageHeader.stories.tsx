import type { Meta, StoryObj } from "@storybook/nextjs";
import PageHeader from "./PageHeader";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const meta: Meta<typeof PageHeader> = {
  title: "UI/Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Cabeçalho de página flexível com título e ação opcional.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Título da página",
    },
    titleVariant: {
      control: {
        type: "select",
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      },
      description: "Variant do Typography para o título",
    },
    titleColor: {
      control: "text",
      description: "Cor do título",
    },
    mb: {
      control: { type: "number", min: 0, max: 10, step: 1 },
      description: "Margem inferior",
    },
    inline: {
      control: "boolean",
      description: "Se deve exibir em linha ou coluna",
    },
    gap: {
      control: { type: "number", min: 0, max: 10, step: 1 },
      description: "Gap entre título e ação quando inline",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Dashboard",
    titleVariant: "h4",
    titleColor: "primary",
    mb: 3,
    inline: true,
    gap: 2,
  },
};

export const WithAction: Story = {
  args: {
    title: "Eventos",
    titleVariant: "h4",
    titleColor: "primary",
    mb: 3,
    inline: true,
    gap: 2,
    action: (
      <Button variant="contained" startIcon={<AddIcon />}>
        Novo Evento
      </Button>
    ),
  },
};
