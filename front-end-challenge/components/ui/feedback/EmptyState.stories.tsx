import type { Meta, StoryObj } from "@storybook/nextjs";
import EmptyState from "./EmptyState";
import {
  EventNote,
  SearchOff,
  PersonOff,
  FolderOpen,
  CloudOff,
  NotificationsOff,
} from "@mui/icons-material";

const meta: Meta<typeof EmptyState> = {
  title: "UI/Feedback/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Componente para exibir estados vazios com opção de ação.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Título do estado vazio",
    },
    description: {
      control: "text",
      description: "Descrição explicativa",
    },
    actionText: {
      control: "text",
      description: "Texto do botão de ação (opcional)",
    },
    onAction: {
      description: "Função executada ao clicar no botão",
    },
    icon: {
      description: "Ícone personalizado (opcional)",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "400px", width: "100%", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Nenhum item encontrado",
    description: "Não há itens para exibir no momento.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Nenhum evento cadastrado",
    description:
      "Comece criando seu primeiro evento para organizar suas atividades.",
    actionText: "Criar Evento",
    onAction: () => console.log("Create event clicked"),
  },
};

export const NoEvents: Story = {
  args: {
    title: "Nenhum evento encontrado",
    description: "Não existem eventos cadastrados. Que tal criar o primeiro?",
    actionText: "Adicionar Evento",
    onAction: () => alert("Redirecionando para criação de evento..."),
    icon: <EventNote sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />,
  },
};

export const NoSearchResults: Story = {
  args: {
    title: "Nenhum resultado encontrado",
    description:
      "Tente ajustar os filtros ou termos de busca para encontrar o que procura.",
    actionText: "Limpar Filtros",
    onAction: () => console.log("Clear filters clicked"),
    icon: <SearchOff sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />,
  },
};

export const NoUsers: Story = {
  args: {
    title: "Nenhum usuário cadastrado",
    description:
      "A lista de usuários está vazia. Convide pessoas para participar.",
    actionText: "Convidar Usuários",
    onAction: () => console.log("Invite users clicked"),
    icon: <PersonOff sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />,
  },
};

export const EmptyFolder: Story = {
  args: {
    title: "Pasta vazia",
    description: "Esta pasta não contém nenhum arquivo ou documento.",
    icon: <FolderOpen sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />,
  },
};

export const ConnectionError: Story = {
  args: {
    title: "Sem conexão",
    description:
      "Não foi possível carregar os dados. Verifique sua conexão com a internet.",
    actionText: "Tentar Novamente",
    onAction: () => console.log("Retry clicked"),
    icon: <CloudOff sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />,
  },
};

export const NoNotifications: Story = {
  args: {
    title: "Nenhuma notificação",
    description: "Você está em dia! Não há notificações pendentes.",
    icon: (
      <NotificationsOff sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
    ),
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const handleAction = (actionType: string) => {
      alert(`Ação executada: ${actionType}`);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "100%",
        }}
      >
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h4>💡 Exemplo Interativo</h4>
          <p>Clique nos botões para testar as ações dos estados vazios:</p>
        </div>

        <EmptyState
          title="Área de Teste Interativo"
          description="Este é um exemplo interativo. Clique no botão abaixo para testar a funcionalidade."
          actionText="Executar Ação"
          onAction={() => handleAction("Teste Interativo")}
          icon={
            <EventNote sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          }
        />
      </div>
    );
  },
};

export const AllVariations: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        <EmptyState
          title="Sem Eventos"
          description="Nenhum evento cadastrado."
          actionText="Criar Evento"
          onAction={() => console.log("Create event")}
          icon={
            <EventNote sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
          }
        />
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        <EmptyState
          title="Busca Vazia"
          description="Nenhum resultado encontrado."
          actionText="Limpar Filtros"
          onAction={() => console.log("Clear filters")}
          icon={
            <SearchOff sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
          }
        />
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        <EmptyState
          title="Sem Conexão"
          description="Verifique sua internet."
          actionText="Tentar Novamente"
          onAction={() => console.log("Retry")}
          icon={
            <CloudOff sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
          }
        />
      </div>

      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        <EmptyState
          title="Pasta Vazia"
          description="Nenhum arquivo encontrado."
          icon={
            <FolderOpen sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
          }
        />
      </div>
    </div>
  ),
};
