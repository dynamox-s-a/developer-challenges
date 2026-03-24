# DynaQuiz

Aplicativo de quiz multiplataforma desenvolvido com **Kotlin Multiplatform** e **Compose Multiplatform**.

---

## Pré-requisitos

- **Android Studio** Ladybug (2024.2.1) ou superior
- **JDK 17** ou superior
- **Android SDK** API 24+

---

## Como rodar

1. Abra a pasta `quiz-kmp/` no Android Studio (**File > Open**)
2. Aguarde o Gradle sincronizar (clique em **Sync Now** se necessário)
3. Conecte um dispositivo Android ou inicie um emulador (API 24+)
4. Selecione a configuração `composeApp` e clique em **Run** (▶)

### Rodar testes

```bash
./gradlew :composeApp:allTests
```

---

## Arquitetura

**Clean Architecture + MVVM**

| Camada | Responsabilidade |
|---|---|
| `data/` | API (Ktor), banco de dados (SQLDelight), repositórios |
| `domain/` | Modelos, interfaces de repositório, casos de uso |
| `presentation/` | Telas, ViewModels, navegação, tema |
| `di/` | Módulos de injeção de dependência (Koin) |

---

## Tecnologias

| Biblioteca | Versão |
|---|---|
| Kotlin Multiplatform | 2.1.0 |
| Compose Multiplatform | 1.7.3 |
| Ktor | 3.0.3 |
| SQLDelight | 2.0.2 |
| Koin | 4.0.0 |
| Kotlinx Coroutines | 1.9.0 |

---

## API

**Base URL:** `https://quiz-api-bwi5hjqyaq-uc.a.run.app`

| Endpoint | Método | Descrição |
|---|---|---|
| `/question` | GET | Retorna uma pergunta aleatória |
| `/answer?questionId={id}` | POST | Verifica se a resposta está correta |

---

## Premissas

- Jogadores são identificados apenas pelo nome/apelido, sem autenticação.
- Cada sessão tem exatamente 10 perguntas.
- O placar é salvo localmente (SQLite) e exibe os 20 melhores resultados.
- Sem cache de perguntas — falhas de rede exibem tela de erro com botão de retry.

---

Desenvolvido como parte do **Desafio Kotlin Multiplatform**.
