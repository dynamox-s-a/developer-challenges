import type { Meta, StoryObj } from "@storybook/nextjs";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
  title: "UI/Feedback/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Componente de carregamento usando CircularProgress do Material-UI.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBackdrop: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          height: "200px",
          position: "relative",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
