import type { Meta, StoryObj } from "@storybook/nextjs";
import LogoutButton from "./LogoutButton";

const meta: Meta<typeof LogoutButton> = {
  title: "UI/Actions/LogoutButton",
  component: LogoutButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão de logout com estilo outlined.",
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
    onClick: () => console.log("Logout clicked"),
  },
};

export const Interactive: Story = {
  args: {
    onClick: () => {
      if (confirm("Deseja realmente sair?")) {
        alert("Logout realizado!");
      }
    },
  },
};
