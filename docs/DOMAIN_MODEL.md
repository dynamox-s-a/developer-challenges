# Domain Model - Quiz Application

## Linguagem Ubíqua (Ubiquitous Language)

- **Player**: Usuário que participa do quiz
- **Quiz Session**: Uma sessão de quiz em andamento ou finalizada
- **Question**: Pergunta com múltiplas opções de resposta
- **Answer**: Resposta do jogador para uma pergunta específica
- **Score**: Pontuação de uma sessão de quiz
- **Quiz History**: Histórico de todas as sessões de um jogador

## Conceitos do Domínio

### Value Objects (sem identidade, definidos pelo valor)

**PlayerName**
- Nome do jogador, entre 2 e 50 caracteres
- Espaços extras no início/fim são removidos automaticamente

**QuestionId**
- Identificador único de uma pergunta
- Não pode ser vazio

**SessionId**
- Identificador único de uma sessão
- Gerado automaticamente

**AnswerOption**
- Uma opção de resposta para uma pergunta
- Não pode ser vazia

**QuestionStatement**
- O enunciado de uma pergunta
- Não pode ser vazio

**Score**
- Representa o resultado de uma sessão completada
- Quantidade de acertos sobre o total de perguntas
- Percentual é derivado dos acertos

**Timestamp**
- Momento em que algo ocorreu, sempre em UTC

### Entidades (com identidade)

**Question**
- Possui um enunciado e 5 opções de resposta
- Identificada pelo seu QuestionId

**Player**
- Identificado por um ID único
- Possui nome e data de criação

**Answer**
- Registro de uma resposta dada pelo jogador
- Contém a opção selecionada, se estava correta e quando foi respondida

**QuizSession** (conceito central)
- Contém exatamente 10 perguntas
- Pertence a um jogador
- Registra as respostas conforme o jogador avança
- Possui um status: em andamento, completada ou abandonada
- O score só existe quando a sessão é completada

### Agregados

**Player Aggregate**
- Raiz: Player
- Gerencia identidade e histórico de sessões

**QuizSession Aggregate**
- Raiz: QuizSession
- Gerencia o fluxo de perguntas e respostas
- Garante todas as invariantes da sessão

## Fluxos de Negócio

### Gestão de Jogadores
- Registrar um novo jogador com nome válido
- Buscar jogador existente ou criar novo
- Listar todos os jogadores

### Sessão de Quiz
- Iniciar nova sessão buscando 10 perguntas únicas
- Retomar sessão em andamento
- Responder uma pergunta da sessão
- Consultar a pergunta atual
- Completar a sessão e calcular score

### Histórico e Pontuações
- Consultar histórico de sessões completadas de um jogador
- Consultar pontuações de todos os jogadores com melhor score e média

## Regras de Negócio Invariantes

1. Uma sessão de quiz tem exatamente 10 perguntas
2. Cada pergunta só pode ser respondida uma vez por sessão
3. Sessão só pode ser completada quando todas as perguntas forem respondidas
4. Score é calculado apenas em sessões completadas
5. Perguntas em uma sessão não podem se repetir
6. Uma vez completada, uma sessão não pode ser modificada
7. Um jogador pode ter apenas uma sessão em andamento por vez
8. Timestamps são sempre em UTC

## Serviços do Domínio

**QuizSessionService**
- Coordena a criação de sessões com busca de perguntas

**ScoreCalculator**
- Calcula o resultado a partir das respostas dadas

## Eventos do Domínio (para extensibilidade futura)

- Jogador registrado
- Sessão de quiz iniciada
- Pergunta respondida
- Sessão de quiz completada