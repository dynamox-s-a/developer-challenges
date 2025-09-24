import type { Meta, StoryObj } from "@storybook/nextjs";
import PageContainer from "./PageContainer";
import { Box, Typography, Card, CardContent, Alert } from "@mui/material";

const meta: Meta<typeof PageContainer> = {
  title: "UI/Layout/PageContainer",
  component: PageContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "⚠️ **DEPRECADO**: Use AppContainer ao invés disso com maxWidth: 800. Mantido para compatibilidade.",
      },
    },
  },
  tags: ["autodocs", "deprecated"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div>
    <Alert severity="warning" sx={{ mb: 3 }}>
      <Typography variant="body2">
        <strong>Componente Deprecado:</strong> Use <code>AppContainer</code> com{" "}
        <code>maxWidth: 800</code>
        ao invés deste componente.
      </Typography>
    </Alert>

    <Typography variant="h4" component="h1" gutterBottom>
      Página de Exemplo
    </Typography>

    <Typography variant="body1" paragraph>
      Este é o PageContainer deprecado que internamente usa AppContainer com
      largura fixa de 800px. É mantido apenas para compatibilidade com código
      legado.
    </Typography>

    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Conteúdo da Página
        </Typography>
        <Typography variant="body2">
          O PageContainer força uma largura máxima de 800px, ideal para páginas
          de conteúdo textual como artigos ou formulários.
        </Typography>
      </CardContent>
    </Card>

    <Box sx={{ p: 2, backgroundColor: "info.light", borderRadius: 1 }}>
      <Typography variant="body2" color="info.contrastText">
        💡 <strong>Migração Recomendada:</strong>
        <br />
        Substitua <code>{`<PageContainer>`}</code> por{" "}
        <code>{`<AppContainer maxWidth={800}>`}</code>
      </Typography>
    </Box>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const ComparisonWithAppContainer: Story = {
  render: () => (
    <Box sx={{ p: 2, backgroundColor: "grey.50" }}>
      <Typography variant="h5" gutterBottom>
        📊 Comparação: PageContainer vs AppContainer
      </Typography>

      <Typography variant="body1" paragraph>
        Demonstração visual da diferença entre o componente deprecado e a
        alternativa recomendada:
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* PageContainer (Deprecado) */}
        <Box>
          <Typography variant="h6" color="error" gutterBottom>
            ❌ PageContainer (Deprecado)
          </Typography>
          <PageContainer>
            <Card>
              <CardContent>
                <Typography variant="body1">
                  Largura fixa de 800px sem customização possível. Menos
                  flexível e marcado como deprecado.
                </Typography>
              </CardContent>
            </Card>
          </PageContainer>
        </Box>

        {/* AppContainer Equivalente */}
        <Box>
          <Typography variant="h6" color="success.main" gutterBottom>
            ✅ AppContainer com maxWidth: 800 (Recomendado)
          </Typography>
          <Box
            sx={{
              minHeight: "100vh",
              backgroundColor: "grey.50",
              py: 4,
            }}
          >
            <Box
              sx={{
                maxWidth: 800,
                mx: "auto",
                px: 2,
              }}
            >
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    Mesma largura de 800px mas com total customização:
                    backgroundColor, py, px, minHeight, etc.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Vantagens do AppContainer:</strong>
          <br />
          • Controle total sobre espaçamento e cores
          <br />
          • Não está deprecado
          <br />
          • Mais flexível para diferentes layouts
          <br />• Mesma API do ContentWrapper interno
        </Typography>
      </Alert>
    </Box>
  ),
};

export const MigrationExample: Story = {
  render: () => (
    <Box sx={{ p: 3, backgroundColor: "grey.50" }}>
      <Typography variant="h4" gutterBottom>
        🔄 Guia de Migração
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Código Antigo */}
        <Card>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              ❌ Código Antigo (Deprecado)
            </Typography>
            <Box
              sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1, mb: 2 }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
              >
                {`import PageContainer from './PageContainer';

function MyPage() {
  return (
    <PageContainer>
      <h1>Minha Página</h1>
      <p>Conteúdo...</p>
    </PageContainer>
  );
}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Sem opções de customização disponíveis.
            </Typography>
          </CardContent>
        </Card>

        {/* Código Novo */}
        <Card>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ Código Novo (Recomendado)
            </Typography>
            <Box
              sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1, mb: 2 }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
              >
                {`import AppContainer from './AppContainer';

function MyPage() {
  return (
    <AppContainer maxWidth={800}>
      <h1>Minha Página</h1>
      <p>Conteúdo...</p>
    </AppContainer>
  );
}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Mesma funcionalidade + opções de customização.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Migração Simples:</strong> Apenas substitua o import e o nome
          do componente, adicionando <code>maxWidth={`{800}`}</code> para manter
          o mesmo comportamento.
        </Typography>
      </Alert>
    </Box>
  ),
};

export const LegacyUsageExample: Story = {
  args: {
    children: (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Este exemplo mostra como o PageContainer ainda funciona, mas é
          recomendado migrar para AppContainer.
        </Alert>

        <Typography variant="h4" gutterBottom>
          Formulário de Contato
        </Typography>

        <Typography variant="body1" paragraph>
          Este é um exemplo de uso típico do PageContainer para uma página de
          formulário com largura limitada.
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informações de Contato
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  Nome: [Campo de entrada]
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  Email: [Campo de entrada]
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "grey.100",
                  borderRadius: 1,
                  minHeight: 100,
                }}
              >
                <Typography variant="body2">
                  Mensagem: [Área de texto]
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: 1,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">Enviar</Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "grey.400",
                    color: "white",
                    borderRadius: 1,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">Limpar</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          💡 Esta página ficaria idêntica usando AppContainer com maxWidth: 800
        </Typography>
      </Box>
    ),
  },
};
