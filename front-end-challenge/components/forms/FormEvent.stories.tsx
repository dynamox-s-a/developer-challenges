import type { Meta, StoryObj } from "@storybook/nextjs";
import FormEvent from "./FormEvent";

const meta: Meta<typeof FormEvent> = {
  title: "Forms/FormEvent",
  component: FormEvent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formulário para criação e edição de eventos com validação completa.",
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
    onCancel: {
      description: "Callback executado ao cancelar",
    },
    onDelete: {
      description: "Callback executado ao deletar (modo edição)",
    },
    className: {
      control: "text",
      description: "Classe CSS adicional",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
  args: {
    title: "Cadastrar Evento",
    loading: false,
    onSubmit: (data) => console.log("Event created:", data),
    onCancel: () => console.log("Create cancelled"),
  },
};

export const EditMode: Story = {
  args: {
    title: "Editar Evento",
    loading: false,
    initialData: {
      name: "Workshop de React",
      date: "2024-02-15",
      location: "Auditório Principal",
      description: "Workshop sobre fundamentos do React e hooks.",
      category: "Workshop",
    },
    onSubmit: (data) => console.log("Event updated:", data),
    onCancel: () => console.log("Edit cancelled"),
    onDelete: () => console.log("Event deleted"),
  },
};

export const Loading: Story = {
  args: {
    title: "Salvando Evento...",
    loading: true,
    initialData: {
      name: "Conferência Tech 2024",
      date: "2024-03-20",
      location: "Centro de Convenções",
      description: "Conferência sobre tecnologia e inovação.",
      category: "Conference",
    },
    onSubmit: (data) => console.log("Event submitted:", data),
    onCancel: () => console.log("Cancelled"),
  },
};

export const WithValidationErrors: Story = {
  render: () => {
    return (
      <FormEvent
        title="Formulário com Validação"
        loading={false}
        onSubmit={(data) => {
          // Simular erro de validação
          if (!data.name.trim()) {
            alert("Nome do evento é obrigatório!");
            return;
          }
          if (!data.location.trim()) {
            alert("Local do evento é obrigatório!");
            return;
          }
          console.log("Valid event data:", data);
          alert("Evento válido enviado!");
        }}
        onCancel={() => console.log("Cancelled")}
      />
    );
  },
};

export const AllModes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        maxWidth: "800px",
      }}
    >
      <div>
        <h4>Modo Criação</h4>
        <FormEvent
          title="Novo Evento"
          loading={false}
          onSubmit={(data) => console.log("Create:", data)}
          onCancel={() => console.log("Create cancelled")}
        />
      </div>

      <div>
        <h4>Modo Edição</h4>
        <FormEvent
          title="Editar Evento"
          loading={false}
          initialData={{
            name: "Meetup JavaScript",
            date: "2024-01-25",
            location: "Coworking Tech",
            description: "Encontro mensal da comunidade JS.",
            category: "Meetup",
          }}
          onSubmit={(data) => console.log("Update:", data)}
          onCancel={() => console.log("Edit cancelled")}
          onDelete={() => console.log("Event deleted")}
        />
      </div>
    </div>
  ),
};
