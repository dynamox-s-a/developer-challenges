import type { Meta, StoryObj } from "@storybook/nextjs";
import LoginButton from "./LoginButton";
import SaveButton from "./SaveButton";
import CancelButton from "./CancelButton";
import DeleteButton from "./DeleteButton";
import LogoutButton from "./LogoutButton";
import AddNewEventButton from "./AddNewEventButton";
import ListAllEventsButton from "./ListAllEventsButton";

const meta: Meta = {
  title: "UI/Actions/AllButtons",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Visão geral de todos os botões de ação disponíveis no sistema.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3>Botões de Formulário</h3>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ minWidth: "200px" }}>
            <h4>Login (Normal)</h4>
            <LoginButton loading={false} />
          </div>
          <div style={{ minWidth: "200px" }}>
            <h4>Login (Carregando)</h4>
            <LoginButton loading={true} />
          </div>
        </div>
      </div>

      <div>
        <h3>Botões de Ação</h3>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h4>Salvar</h4>
            <SaveButton loading={false} />
          </div>
          <div>
            <h4>Salvar (Carregando)</h4>
            <SaveButton loading={true} />
          </div>
          <div>
            <h4>Cancelar</h4>
            <CancelButton
              loading={false}
              onClick={() => console.log("Cancel")}
            />
          </div>
          <div>
            <h4>Excluir</h4>
            <DeleteButton
              loading={false}
              onClick={() => console.log("Delete")}
            />
          </div>
          <div>
            <h4>Logout</h4>
            <LogoutButton onClick={() => console.log("Logout")} />
          </div>
        </div>
      </div>

      <div>
        <h3>Botões de Navegação</h3>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h4>Adicionar Evento</h4>
            <AddNewEventButton onClick={() => console.log("Add event")} />
          </div>
          <div>
            <h4>Listar Eventos</h4>
            <ListAllEventsButton onClick={() => console.log("List events")} />
          </div>
        </div>
      </div>

      <div>
        <h3>Estados de Carregamento</h3>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <CancelButton
            loading={true}
            onClick={() => console.log("Cancel disabled")}
          />
          <DeleteButton
            loading={true}
            onClick={() => console.log("Delete disabled")}
          />
        </div>
      </div>
    </div>
  ),
};
