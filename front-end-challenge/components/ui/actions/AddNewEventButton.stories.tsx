import type { Meta, StoryObj } from "@storybook/nextjs";
import AddNewEventButton from "./AddNewEventButton";

const meta: Meta<typeof AddNewEventButton> = {
  title: "UI/Actions/AddNewEventButton",
  component: AddNewEventButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Botão para adicionar novo evento com tipografia personalizada.",
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
    onClick: () => console.log("Add new event clicked"),
  },
};

export const Interactive: Story = {
  args: {
    onClick: () => alert("Redirecionando para cadastro de evento..."),
  },
};
