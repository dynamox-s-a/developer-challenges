import type { Meta, StoryObj } from "@storybook/nextjs";
import AlertMessage from "./AlertMessage";

const meta: Meta<typeof AlertMessage> = {
  title: "UI/Feedback/AlertMessage",
  component: AlertMessage,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Componente de mensagem de alerta para exibir erros.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: {
      control: "text",
      description: "Mensagem de erro a ser exibida",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Ocorreu um erro ao processar sua solicitação.",
  },
};

export const LoginError: Story = {
  args: {
    message: "Email ou senha incorretos. Tente novamente.",
  },
};

export const NetworkError: Story = {
  args: {
    message: "Erro de conexão. Verifique sua internet e tente novamente.",
  },
};

export const ValidationError: Story = {
  args: {
    message: "Preencha todos os campos obrigatórios antes de continuar.",
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "Esta é uma mensagem de erro muito longa para testar como o componente se comporta com textos extensos. O erro pode conter informações técnicas detalhadas sobre o que aconteceu e como o usuário pode resolver o problema.",
  },
};

export const AllExamples: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <h4>Erro Genérico</h4>
        <AlertMessage message="Ocorreu um erro inesperado." />
      </div>

      <div>
        <h4>Erro de Login</h4>
        <AlertMessage message="Credenciais inválidas. Verifique email e senha." />
      </div>

      <div>
        <h4>Erro de Rede</h4>
        <AlertMessage message="Falha na conexão com o servidor." />
      </div>

      <div>
        <h4>Erro de Validação</h4>
        <AlertMessage message="Os dados fornecidos não são válidos." />
      </div>
    </div>
  ),
};
