import type { Meta, StoryObj } from "@storybook/nextjs";
import ContentWrapper from "./ContentWrapper";
import { Box, Typography, Card, CardContent } from "@mui/material";

const meta: Meta<typeof ContentWrapper> = {
  title: "UI/Layout/ContentWrapper",
  component: ContentWrapper,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Wrapper para controlar largura máxima, centralização e padding horizontal do conteúdo.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: { type: "range", min: 300, max: 1600, step: 100 },
      description: "Largura máxima do conteúdo",
      defaultValue: 1200,
    },
    px: {
      control: { type: "range", min: 0, max: 6, step: 1 },
      description: "Padding horizontal",
      defaultValue: 2,
    },
    centered: {
      control: "boolean",
      description: "Se deve centralizar o conteúdo horizontalmente",
      defaultValue: true,
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ backgroundColor: "grey.100", minHeight: "400px", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = ({ title = "Conteúdo de Exemplo" }) => (
  <div>
    <Typography variant="h5" component="h2" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" paragraph>
      Este ContentWrapper controla a largura máxima e centralização do conteúdo.
      É útil para manter layouts consistentes e legíveis.
    </Typography>
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Card Interno
        </Typography>
        <Typography variant="body2">
          O conteúdo dentro do wrapper mantém as proporções adequadas
          independente do tamanho da tela.
        </Typography>
      </CardContent>
    </Card>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const Narrow: Story = {
  args: {
    maxWidth: 600,
    children: (
      <Box
        sx={{ border: "2px dashed #1976d2", p: 2, backgroundColor: "white" }}
      >
        <SampleContent title="Layout Estreito (600px)" />
        <Typography variant="body2" color="text.secondary">
          Ideal para conteúdo textual, formulários ou artigos.
        </Typography>
      </Box>
    ),
  },
};

export const Wide: Story = {
  args: {
    maxWidth: 1600,
    children: (
      <Box
        sx={{ border: "2px dashed #d32f2f", p: 2, backgroundColor: "white" }}
      >
        <SampleContent title="Layout Amplo (1600px)" />
        <Typography variant="body2" color="text.secondary">
          Ideal para dashboards com múltiplas colunas ou tabelas extensas.
        </Typography>
      </Box>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    px: 0,
    children: (
      <Box sx={{ border: "2px solid #ff9800", backgroundColor: "white" }}>
        <Box sx={{ p: 2 }}>
          <SampleContent title="Sem Padding Horizontal" />
          <Typography variant="body2" color="text.secondary">
            O conteúdo vai até as bordas laterais do wrapper. Note que a borda
            laranja toca as laterais.
          </Typography>
        </Box>
      </Box>
    ),
  },
};

export const MaxPadding: Story = {
  args: {
    px: 6,
    children: (
      <Box
        sx={{ border: "2px dashed #4caf50", p: 2, backgroundColor: "white" }}
      >
        <SampleContent title="Padding Máximo" />
        <Typography variant="body2" color="text.secondary">
          Padding horizontal amplo (6) para layouts mais espaçosos.
        </Typography>
      </Box>
    ),
  },
};

export const NotCentered: Story = {
  args: {
    centered: false,
    maxWidth: 800,
    children: (
      <Box
        sx={{ border: "2px dashed #9c27b0", p: 2, backgroundColor: "white" }}
      >
        <SampleContent title="Não Centralizado" />
        <Typography variant="body2" color="text.secondary">
          Conteúdo alinhado à esquerda ao invés de centralizado. Note que o
          wrapper fica colado à esquerda da tela.
        </Typography>
      </Box>
    ),
  },
};

export const ResponsiveExample: Story = {
  args: {
    maxWidth: 1000,
    children: (
      <div>
        <Typography variant="h4" gutterBottom>
          Layout Responsivo
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Desktop
              </Typography>
              <Typography variant="body2">
                3 colunas em telas grandes
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">
                Tablet
              </Typography>
              <Typography variant="body2">2 colunas em telas médias</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Mobile
              </Typography>
              <Typography variant="body2">
                1 coluna em telas pequenas
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Typography variant="body1" color="text.secondary">
          O ContentWrapper mantém o conteúdo em proporções adequadas em todos os
          tamanhos de tela, trabalhando junto com o sistema de grid responsivo
          do Material-UI.
        </Typography>
      </div>
    ),
  },
};

export const FormLayout: Story = {
  args: {
    maxWidth: 600,
    children: (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Formulário de Exemplo
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <Box
              sx={{ mb: 2, p: 1, backgroundColor: "grey.100", borderRadius: 1 }}
            >
              <Typography variant="body2">Campo: Nome</Typography>
            </Box>
            <Box
              sx={{ mb: 2, p: 1, backgroundColor: "grey.100", borderRadius: 1 }}
            >
              <Typography variant="body2">Campo: Email</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                p: 1,
                backgroundColor: "grey.100",
                borderRadius: 1,
                minHeight: 80,
              }}
            >
              <Typography variant="body2">
                Campo: Descrição (textarea)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: 1,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">Salvar</Typography>
              </Box>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "grey.300",
                  borderRadius: 1,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">Cancelar</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    ),
  },
};

export const AllVariations: Story = {
  render: () => (
    <Box sx={{ backgroundColor: "grey.50", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        🎨 Variações do ContentWrapper
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Centralizado vs Não-centralizado */}
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            Alinhamento
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <Typography
                variant="caption"
                sx={{ p: 1, backgroundColor: "grey.100", display: "block" }}
              >
                Centralizado (padrão)
              </Typography>
              <ContentWrapper maxWidth={300} px={1}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: "primary.light",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Centralizado
                </Box>
              </ContentWrapper>
            </Box>
            <Box sx={{ flex: 1, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <Typography
                variant="caption"
                sx={{ p: 1, backgroundColor: "grey.100", display: "block" }}
              >
                À esquerda
              </Typography>
              <ContentWrapper maxWidth={300} px={1} centered={false}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: "secondary.light",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  À esquerda
                </Box>
              </ContentWrapper>
            </Box>
          </Box>
        </Box>

        {/* Diferentes larguras */}
        <Box>
          <Typography variant="h6" gutterBottom color="primary">
            Larguras Máximas
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <ContentWrapper maxWidth={400} px={1}>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "success.light",
                  color: "white",
                  textAlign: "center",
                }}
              >
                400px - Estreito
              </Box>
            </ContentWrapper>
            <ContentWrapper maxWidth={800} px={1}>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "warning.light",
                  color: "white",
                  textAlign: "center",
                }}
              >
                800px - Médio
              </Box>
            </ContentWrapper>
            <ContentWrapper maxWidth={1200} px={1}>
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "error.light",
                  color: "white",
                  textAlign: "center",
                }}
              >
                1200px - Padrão
              </Box>
            </ContentWrapper>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};
