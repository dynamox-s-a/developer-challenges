# Domain Model - Quiz Application

## Linguagem Ubíqua (Ubiquitous Language)

- **Player**: Usuário que participa do quiz, identificado por nome único
- **Quiz Session**: Sessão de quiz com até 10 perguntas vinculada a um jogador
- **Question**: Pergunta com enunciado e exatamente 5 opções de resposta
- **Answer**: Resposta do jogador — associa uma pergunta à opção selecionada
- **Score**: Contador de acertos em uma sessão

## Value Objects

Objetos imutáveis sem identidade, definidos pelo valor. Todos utilizam factory methods com `Result<T>` para validação segura.

**PlayerId**
- Identificador UUID do jogador
- `generate()` cria um novo ID, `create(value)` valida existente

**PlayerName**
- Nome do jogador, entre 2 e 50 caracteres
- Trim automático de espaços no início/fim

**QuizSessionId**
- Identificador UUID da sessão
- `generate()` cria um novo ID, `create(value)` valida existente

**QuestionId**
- Identificador da pergunta (string não vazia, com trim)

**QuestionStatement**
- Texto/enunciado da pergunta (string não vazia, com trim)

**AnswerOption**
- Texto de uma alternativa de resposta (string não vazia, com trim)

**Score**
- Inteiro não-negativo representando acertos
- `increment()` retorna novo Score com valor +1

## Entidades

**Question**
- Campos: `id: QuestionId`, `statement: QuestionStatement`, `options: List<AnswerOption>`
- Invariante: exatamente 5 opções únicas
- Factory method `create()` valida todas as regras

**Player**
- Campos: `id: PlayerId`, `name: PlayerName`, `scores: List<Int>`
- `create(name)` gera ID automático com scores vazio
- `restore(id, name, scores)` reconstrói a partir da persistência
- `addScore(value)` retorna novo Player com score adicionado (imutável)

**Answer**
- Campos: `questionId: QuestionId`, `selectedOption: AnswerOption`
- Registro simples da opção escolhida para uma pergunta

## Agregados

**QuizSession** (Aggregate Root)
- Campos: `id: QuizSessionId`, `playerId: PlayerId`, `questions: List<Question>`, `answers: List<Answer>`, `score: Score`
- `MAX_QUESTIONS = 10`
- `addNewQuestion(question)` — adiciona pergunta se não atingiu o limite e não é duplicada
- `answerQuestion(questionId, selectedOption, isCorrect)` — registra resposta; incrementa score se correta; rejeita pergunta já respondida ou inexistente
- `isFinished` — verdadeiro quando `questions.size == 10 && answers.size == 10`
- `currentQuestionIndex` — número de respostas dadas (indica próxima pergunta)

## Ports (Interfaces de Repositório)

Definidas no domínio, implementadas na infraestrutura (Hexagonal Architecture).

**PlayerRepository**
- `save(player)` — persiste jogador
- `getByName(name)` — busca por nome (retorna null se não existe)
- `getAll()` — lista todos os jogadores

**QuestionRepository**
- `getRandomQuestion()` — obtém pergunta aleatória da API
- `checkAnswer(questionId, answer)` — verifica resposta via API (retorna `Boolean`)

**QuizSessionRepository**
- `save(session)` — persiste sessão
- `getById(id)` — busca sessão por ID

## Use Cases (Camada Application)

**RegisterOrLoginPlayerUseCase**
- Busca jogador por nome; se não existe, cria novo
- Retorna `Result<Player>`

**StartNewQuizSessionUseCase**
- Registra/busca jogador e cria nova sessão com a primeira pergunta
- Retorna `Result<QuizSession>`

**FillSessionUseCase**
- Preenche a sessão até atingir 10 perguntas únicas
- Retry com até 30 tentativas para lidar com duplicatas e falhas de rede
- Retorna `Result<QuizSession>`

**AnswerQuestionUseCase**
- Carrega sessão, valida resposta via API, delega ao agregado
- Persiste sessão e atualiza score do jogador se a sessão finalizou
- Retorna `Result<Boolean>` (acertou ou não)

## Regras de Negócio Implementadas

1. Uma sessão tem no máximo 10 perguntas
2. Cada pergunta só pode ser respondida uma vez por sessão
3. Perguntas em uma sessão não se repetem (verificação por `QuestionId`)
4. Nomes de jogadores têm entre 2 e 50 caracteres
5. Cada pergunta deve ter exatamente 5 opções únicas
6. Scores são acumulados por jogador (lista de resultados de cada quiz)

## Evolução Futura

Ideias para evolução do domínio que não foram implementadas nesta versão:

- **Status de sessão** (em andamento / completada / abandonada) com máquina de estados
- **Timestamp** em entidades (criação de jogador, momento de cada resposta)
- **Retomada de sessão** — encontrar e continuar sessão interrompida
- **Restrição de sessão ativa** — um jogador pode ter apenas uma sessão em andamento
- **Domain Events** — `PlayerRegistered`, `QuestionAnswered`, `SessionCompleted` para extensibilidade
- **Score enriquecido** — total de perguntas, percentual, tempo de resposta