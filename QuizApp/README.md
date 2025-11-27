# QuizApp (Dynamox Challenge)

Aplicativo Android nativo de Quiz, desenvolvido com foco em Arquitetura Limpa, Escalabilidade e Experiência do Usuário.

## Tecnologias & Decisões Arquiteturais

### Infraestrutura e Build
- **Version Catalog (TOML):** Centralização de dependências para facilitar manutenção e evitar conflitos de versão.
- **Java 17 & SDK 35:** Configurado para compatibilidade com os padrões mais recentes da indústria, mantendo estabilidade.

### Bibliotecas Principais
- **Retrofit + Gson:** Escolhido pela robustez e simplicidade para APIs REST padrão, conforme requisitos do desafio.
- **Hilt:** Para Injeção de Dependência, garantindo desacoplamento e testabilidade.
- **Room:** Para persistência local do histórico.
- **Jetpack Compose:** UI moderna e declarativa.

## Funcionalidades

- [x] **Setup Inicial:** Configuração de Gradle, GitFlow e Infraestrutura.
- [ ] **Camada de Domínio:** Modelagem de dados e regras de negócio.
- [ ] **Camada de Dados:** Repositórios, API e Banco de Dados.
- [ ] **UI - Quiz:** Telas de perguntas e feedback.
- [ ] **UI - Histórico:** Listagem de pontuações.

## Como rodar

1. Clone o repositório.
2. Abra a pasta `QuizApp` no Android Studio Ladybug (ou superior).
3. Aguarde o Sync do Gradle.
4. Execute no Emulador (Min SDK 24).