import type { Meta, StoryObj } from "@storybook/nextjs";
import CancelButton from "./CancelButton";

const meta: Meta<typeof CancelButton> = {
  title: "UI/Actions/CancelButton",
  component: CancelButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão de cancelar com ação de clique.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Estado de carregamento do botão",
    },
    onClick: {
      description: "Função executada ao clicar no botão",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    onClick: () => console.log("Cancel clicked"),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    onClick: () => console.log("Cancel clicked"),
  },
};

export const Interactive: Story = {
  args: {
    loading: false,
    onClick: () => alert("Ação cancelada!"),
  },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div>
        <h4>Estado Normal</h4>
        <CancelButton
          loading={false}
          onClick={() => console.log("Cancel normal")}
        />
      </div>
      <div>
        <h4>Estado Carregando (Desabilitado)</h4>
        <CancelButton
          loading={true}
          onClick={() => console.log("Cancel loading")}
        />
      </div>
    </div>
  ),
};
