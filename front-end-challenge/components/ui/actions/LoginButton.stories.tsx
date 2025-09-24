import type { Meta, StoryObj } from "@storybook/nextjs";
import LoginButton from "./LoginButton";

const meta: Meta<typeof LoginButton> = {
  title: "UI/Actions/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Botão de login com ícone e estados de carregamento.",
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
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
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
        width: "300px",
      }}
    >
      <div>
        <h4>Estado Normal</h4>
        <LoginButton loading={false} />
      </div>
      <div>
        <h4>Estado Carregando</h4>
        <LoginButton loading={true} />
      </div>
    </div>
  ),
};
