import type { Meta, StoryObj } from "@storybook/nextjs";
import LoginForm from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Forms/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formulário de login com validação e controles de visibilidade de senha.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Título do formulário",
    },
    loading: {
      control: "boolean",
      description: "Estado de carregamento do formulário",
    },
    onSubmit: {
      description: "Callback executado ao submeter o formulário",
    },
    className: {
      control: "text",
      description: "Classe CSS adicional",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Login",
    loading: false,
    onSubmit: (data) => console.log("Form submitted:", data),
  },
};

export const Loading: Story = {
  args: {
    title: "Login",
    loading: true,
    onSubmit: (data) => console.log("Form submitted:", data),
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Acesso Administrativo",
    loading: false,
    onSubmit: (data) => console.log("Form submitted:", data),
  },
};
