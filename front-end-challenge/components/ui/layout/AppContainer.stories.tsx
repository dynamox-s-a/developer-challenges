import type { Meta, StoryObj } from "@storybook/nextjs";
import AppContainer from "./AppContainer";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

const meta: Meta<typeof AppContainer> = {
  title: "UI/Layout/AppContainer",
  component: AppContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Container principal da aplicação com controle de fundo, espaçamento e largura máxima do conteúdo.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: "color",
      description: "Cor de fundo do container",
      defaultValue: "grey.50",
    },
    py: {
      control: { type: "range", min: 0, max: 8, step: 1 },
      description: "Padding vertical",
      defaultValue: 4,
    },
    minHeight: {
      control: "text",
      description: "Altura mínima do container",
      defaultValue: "100vh",
    },
    maxWidth: {
      control: { type: "range", min: 600, max: 1600, step: 100 },
      description: "Largura máxima do conteúdo interno",
      defaultValue: 1200,
    },
    px: {
      control: { type: "range", min: 0, max: 6, step: 1 },
      description: "Padding horizontal do conteúdo interno",
      defaultValue: 2,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div>
    <Typography variant="h4" component="h1" gutterBottom>
      Conteúdo de Exemplo
    </Typography>
    <Typography variant="body1" paragraph>
      Este é um conteúdo de exemplo para demonstrar como o AppContainer
      funciona. Ele controla o fundo da página, espaçamento e largura máxima do
      conteúdo.
    </Typography>
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Card de Exemplo
        </Typography>
        <Typography variant="body2">
          O AppContainer mantém o conteúdo centralizado e com largura
          controlada.
        </Typography>
      </CardContent>
    </Card>
    <Button variant="contained" color="primary">
      Botão de Exemplo
    </Button>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const MinimalPadding: Story = {
  args: {
    py: 1,
    px: 1,
    children: (
      <Box sx={{ border: "2px dashed #ccc", p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Padding Mínimo
        </Typography>
        <Typography variant="body1">
          Container com padding reduzido para layouts mais compactos. A borda
          tracejada mostra os limites do conteúdo interno.
        </Typography>
      </Box>
    ),
  },
};

export const MaximalPadding: Story = {
  args: {
    py: 8,
    px: 6,
    children: (
      <Box sx={{ border: "2px dashed #ccc", p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Padding Máximo
        </Typography>
        <Typography variant="body1">
          Container com padding amplo para layouts mais espaçosos. Note o
          espaçamento generoso ao redor do conteúdo.
        </Typography>
      </Box>
    ),
  },
};

export const NarrowWidth: Story = {
  args: {
    maxWidth: 600,
    children: (
      <Box sx={{ border: "2px dashed #007acc", p: 2, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Largura Reduzida (600px)
        </Typography>
        <Typography variant="body1">
          Container com largura máxima reduzida, ideal para conteúdo mais focado
          como artigos ou formulários.
        </Typography>
      </Box>
    ),
  },
};

export const WideWidth: Story = {
  args: {
    maxWidth: 1600,
    children: (
      <Box sx={{ border: "2px dashed #ff6b35", p: 2, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Largura Ampla (1600px)
        </Typography>
        <Typography variant="body1">
          Container com largura máxima aumentada, ideal para dashboards ou
          layouts com muito conteúdo lateral.
        </Typography>
      </Box>
    ),
  },
};

export const CustomHeight: Story = {
  args: {
    minHeight: "50vh",
    backgroundColor: "#f0f8ff",
    children: (
      <Box
        sx={{
          border: "2px dashed #4682b4",
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Altura Personalizada
        </Typography>
        <Typography variant="body1" textAlign="center">
          Container com altura mínima de 50vh ao invés do padrão 100vh. Útil
          para seções específicas da página.
        </Typography>
      </Box>
    ),
  },
};

export const RealWorldExample: Story = {
  args: {
    backgroundColor: "#fafafa",
    children: (
      <div>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Dashboard de Eventos
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Estatísticas Gerais
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  142
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Eventos Ativos
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  2.4k
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Participantes
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  18
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Eventos Hoje
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button variant="contained" color="primary">
            Criar Evento
          </Button>
          <Button variant="outlined">Exportar Dados</Button>
          <Button variant="text">Configurações</Button>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Próximos Eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lista dos eventos programados para os próximos dias...
            </Typography>
          </CardContent>
        </Card>
      </div>
    ),
  },
};

export const AllVariations: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Typography variant="h5" gutterBottom style={{ padding: "1rem" }}>
        🎨 Variações do AppContainer
      </Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle2">Padrão</Typography>
          </div>
          <AppContainer minHeight="200px">
            <Typography variant="body2">Configuração padrão</Typography>
          </AppContainer>
        </div>

        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.5rem",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle2">Largura Reduzida</Typography>
          </div>
          <AppContainer maxWidth={400} minHeight="200px">
            <Typography variant="body2" textAlign="center">
              Largura 400px
            </Typography>
          </AppContainer>
        </div>
      </div>
    </div>
  ),
};
