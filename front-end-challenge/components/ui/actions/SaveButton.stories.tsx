import type { Meta, StoryObj } from "@storybook/nextjs";
import SaveButton from "./SaveButton";

const meta: Meta<typeof SaveButton> = {
  title: "UI/Actions/SaveButton",
  component: SaveButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão de salvar com estados de carregamento.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "Estado de carregamento do botão",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
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
        <SaveButton loading={false} />
      </div>
      <div>
        <h4>Estado Carregando</h4>
        <SaveButton loading={true} />
      </div>
    </div>
  ),
};
