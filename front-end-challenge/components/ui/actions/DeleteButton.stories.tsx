import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteButton from "./DeleteButton";

const meta: Meta<typeof DeleteButton> = {
  title: "UI/Actions/DeleteButton",
  component: DeleteButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão de exclusão com cor de erro e ação de clique.",
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
    onClick: () => console.log("Delete clicked"),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    onClick: () => console.log("Delete clicked"),
  },
};

export const Interactive: Story = {
  args: {
    loading: false,
    onClick: () => {
      if (confirm("Tem certeza que deseja excluir?")) {
        alert("Item excluído!");
      }
    },
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
        <DeleteButton
          loading={false}
          onClick={() => console.log("Delete normal")}
        />
      </div>
      <div>
        <h4>Estado Carregando (Desabilitado)</h4>
        <DeleteButton
          loading={true}
          onClick={() => console.log("Delete loading")}
        />
      </div>
    </div>
  ),
};
