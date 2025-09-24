import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "@mui/material";

const meta: Meta<typeof ConfirmDialog> = {
  title: "UI/Dialogs/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Diálogo de confirmação com diferentes níveis de severidade.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Estado de abertura do diálogo",
    },
    title: {
      control: "text",
      description: "Título do diálogo",
    },
    message: {
      control: "text",
      description: "Mensagem do diálogo",
    },
    confirmText: {
      control: "text",
      description: "Texto do botão de confirmação",
    },
    cancelText: {
      control: "text",
      description: "Texto do botão de cancelamento",
    },
    severity: {
      control: {
        type: "select",
        options: ["warning", "error", "info"],
      },
      description: "Nível de severidade do diálogo",
    },
    onConfirm: {
      description: "Função executada ao confirmar",
    },
    onCancel: {
      description: "Função executada ao cancelar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    open: true,
    title: "Confirmar Ação",
    message: "Tem certeza que deseja prosseguir com esta ação?",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    severity: "warning",
    onConfirm: () => console.log("Confirmed"),
    onCancel: () => console.log("Cancelled"),
  },
};

export const Error: Story = {
  args: {
    open: true,
    title: "Excluir Item",
    message:
      "Esta ação não pode ser desfeita. Tem certeza que deseja excluir permanentemente?",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    severity: "error",
    onConfirm: () => console.log("Item deleted"),
    onCancel: () => console.log("Delete cancelled"),
  },
};

export const Info: Story = {
  args: {
    open: true,
    title: "Informação",
    message: "Deseja salvar as alterações antes de continuar?",
    confirmText: "Salvar",
    cancelText: "Não Salvar",
    severity: "info",
    onConfirm: () => console.log("Changes saved"),
    onCancel: () => console.log("Changes not saved"),
  },
};

export const CustomTexts: Story = {
  args: {
    open: true,
    title: "Finalizar Pedido",
    message:
      "Seu pedido será processado e você receberá uma confirmação por email.",
    confirmText: "Finalizar Pedido",
    cancelText: "Revisar Pedido",
    severity: "info",
    onConfirm: () => console.log("Order finished"),
    onCancel: () => console.log("Order review"),
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<{
      title: string;
      message: string;
      severity: "warning" | "error" | "info";
    }>({
      title: "Confirmar Ação",
      message: "Tem certeza que deseja prosseguir?",
      severity: "warning",
    });

    const openDialog = (config: typeof dialogConfig) => {
      setDialogConfig(config);
      setOpen(true);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <h4>Clique nos botões para abrir diferentes diálogos:</h4>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() =>
              openDialog({
                title: "Confirmar Alteração",
                message: "As alterações serão salvas permanentemente.",
                severity: "warning",
              })
            }
          >
            Aviso
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              openDialog({
                title: "Excluir Conta",
                message:
                  "Esta ação é irreversível. Todos os seus dados serão perdidos.",
                severity: "error",
              })
            }
          >
            Erro
          </Button>

          <Button
            variant="outlined"
            color="info"
            onClick={() =>
              openDialog({
                title: "Informação",
                message: "O sistema será atualizado em breve.",
                severity: "info",
              })
            }
          >
            Info
          </Button>
        </div>

        <ConfirmDialog
          open={open}
          title={dialogConfig.title}
          message={dialogConfig.message}
          severity={dialogConfig.severity}
          onConfirm={() => {
            console.log("Confirmed:", dialogConfig.title);
            alert(`Ação confirmada: ${dialogConfig.title}`);
            setOpen(false);
          }}
          onCancel={() => {
            console.log("Cancelled:", dialogConfig.title);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3>Severidade: Warning</h3>
        <p>Usado para confirmações gerais</p>
        <ConfirmDialog
          open={true}
          title="Confirmar Ação"
          message="Tem certeza que deseja prosseguir?"
          severity="warning"
          onConfirm={() => console.log("Warning confirmed")}
          onCancel={() => console.log("Warning cancelled")}
        />
      </div>

      <div style={{ marginTop: "400px" }}>
        <h3>Severidade: Error</h3>
        <p>Usado para ações destrutivas</p>
        <ConfirmDialog
          open={true}
          title="Excluir Item"
          message="Esta ação não pode ser desfeita."
          severity="error"
          confirmText="Excluir"
          onConfirm={() => console.log("Error confirmed")}
          onCancel={() => console.log("Error cancelled")}
        />
      </div>

      <div style={{ marginTop: "400px" }}>
        <h3>Severidade: Info</h3>
        <p>Usado para informações importantes</p>
        <ConfirmDialog
          open={true}
          title="Informação"
          message="Deseja salvar as alterações?"
          severity="info"
          confirmText="Salvar"
          cancelText="Não Salvar"
          onConfirm={() => console.log("Info confirmed")}
          onCancel={() => console.log("Info cancelled")}
        />
      </div>
    </div>
  ),
};
