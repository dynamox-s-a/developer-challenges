import type { Meta, StoryObj } from "@storybook/nextjs";
import ListAllEventsButton from "./ListAllEventsButton";

const meta: Meta<typeof ListAllEventsButton> = {
  title: "UI/Actions/ListAllEventsButton",
  component: ListAllEventsButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão para listar todos os eventos com estilo outlined.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: {
      description: "Função executada ao clicar no botão",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => console.log("List all events clicked"),
  },
};

export const Interactive: Story = {
  args: {
    onClick: () => alert("Carregando lista de eventos..."),
  },
};
