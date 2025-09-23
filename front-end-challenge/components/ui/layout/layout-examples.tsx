/**
 * Exemplos de uso dos componentes ContentWrapper e PageHeader
 */

import { ContentWrapper, PageHeader, AppContainer } from "@/components/ui";
import { Paper, Typography, Button, IconButton, Box } from "@mui/material";
import { Add as AddIcon, Settings as SettingsIcon } from "@mui/icons-material";

// Exemplo 1: PageHeader básico
export function BasicPageHeaderExample() {
  return (
    <AppContainer>
      <Paper sx={{ p: 4 }}>
        <PageHeader title="Minha Página" />

        <Typography variant="body1">Conteúdo da página aqui...</Typography>
      </Paper>
    </AppContainer>
  );
}

// Exemplo 2: PageHeader com ação (botão)
export function PageHeaderWithActionExample() {
  return (
    <AppContainer>
      <Paper sx={{ p: 4 }}>
        <PageHeader
          title="Gerenciar Eventos"
          action={
            <Button variant="contained" startIcon={<AddIcon />}>
              Novo Evento
            </Button>
          }
        />

        <Typography variant="body1">Lista de eventos aqui...</Typography>
      </Paper>
    </AppContainer>
  );
}

// Exemplo 3: PageHeader com múltiplas ações
export function PageHeaderWithMultipleActionsExample() {
  return (
    <AppContainer>
      <Paper sx={{ p: 4 }}>
        <PageHeader
          title="Dashboard Administrativo"
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
              <Button variant="outlined">Configurações</Button>
              <Button variant="contained">Nova Ação</Button>
            </Box>
          }
        />

        <Typography variant="body1">Conteúdo do dashboard...</Typography>
      </Paper>
    </AppContainer>
  );
}

// Exemplo 4: PageHeader vertical (não inline)
export function VerticalPageHeaderExample() {
  return (
    <AppContainer>
      <Paper sx={{ p: 4 }}>
        <PageHeader
          title="Formulário de Cadastro"
          titleVariant="h3"
          inline={false}
          action={
            <Button variant="text" color="secondary">
              ← Voltar
            </Button>
          }
        />

        <Typography variant="body1">Formulário aqui...</Typography>
      </Paper>
    </AppContainer>
  );
}

// Exemplo 5: ContentWrapper básico
export function BasicContentWrapperExample() {
  return (
    <Box sx={{ backgroundColor: "grey.50", py: 4 }}>
      <ContentWrapper>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4">Conteúdo Centralizado</Typography>
          <Typography variant="body1">
            Este conteúdo está dentro de um ContentWrapper com maxWidth: 1200px
          </Typography>
        </Paper>
      </ContentWrapper>
    </Box>
  );
}

// Exemplo 6: ContentWrapper para formulários
export function FormContentWrapperExample() {
  return (
    <Box sx={{ backgroundColor: "grey.50", py: 4 }}>
      <ContentWrapper maxWidth={800}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5">Formulário Compacto</Typography>
          <Typography variant="body1">
            Este formulário usa maxWidth: 800px para melhor legibilidade
          </Typography>
        </Paper>
      </ContentWrapper>
    </Box>
  );
}

// Exemplo 7: ContentWrapper não centralizado
export function NonCenteredContentWrapperExample() {
  return (
    <Box sx={{ backgroundColor: "grey.50", py: 4, pl: 2 }}>
      <ContentWrapper centered={false} maxWidth={600}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5">Conteúdo Alinhado à Esquerda</Typography>
          <Typography variant="body1">
            Este conteúdo não está centralizado (centered=false)
          </Typography>
        </Paper>
      </ContentWrapper>
    </Box>
  );
}

// Exemplo 8: Combinando AppContainer + ContentWrapper + PageHeader
export function CombinedLayoutExample() {
  return (
    <AppContainer backgroundColor="primary.light" py={6}>
      <ContentWrapper maxWidth={1000}>
        <Paper elevation={4} sx={{ p: 5 }}>
          <PageHeader
            title="Layout Combinado"
            titleVariant="h3"
            titleColor="primary.main"
            action={
              <Button variant="contained" size="large">
                Ação Principal
              </Button>
            }
            mb={4}
          />

          <Typography variant="body1" sx={{ mb: 3 }}>
            Este exemplo mostra como combinar os três componentes de layout:
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" variant="body2">
              <strong>AppContainer:</strong> Container principal com cor
              customizada
            </Typography>
            <Typography component="li" variant="body2">
              <strong>ContentWrapper:</strong> Limita largura do conteúdo
              (1000px)
            </Typography>
            <Typography component="li" variant="body2">
              <strong>PageHeader:</strong> Cabeçalho com título e ação
            </Typography>
          </Box>
        </Paper>
      </ContentWrapper>
    </AppContainer>
  );
}
