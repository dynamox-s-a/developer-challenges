# QuizApp — Dynamox Android Developer Challenge

Aplicativo Android nativo de Quiz desenvolvido para o desafio técnico da **Dynamox**, com foco em *
*Clean Architecture**, **qualidade de código**, **experiência do usuário** e **testabilidade**.

---

## Funcionalidades

- **Quiz Interativo:** Perguntas obtidas via API REST com validação de respostas.
- **Anti-Duplicidade Inteligente:** Garantia de que nenhuma pergunta se repita durante a sessão.
- **Feedback Visual Imediato:** Cores e estados animados indicando resposta correta/incorreta.
- **Histórico Persistente:** Banco de dados local (Room) para armazenar nome do jogador e
  pontuações.
- **UI Moderna:** Jetpack Compose + Material 3 + animações.
- **Internacionalização:** Suporte completo a **PT**, **EN** e **IT**.
- **Edge-to-Edge + Design System:** Integração com status bar transparente e tema focado na
  identidade visual.

---

## 📸 Screenshots

<div style="display: flex; flex-direction: row;">
    <img src="docs/welcome.png" width="22%" />
    <img src="docs/quiz.png" width="22%" />
    <img src="docs/quiz_true.png" width="22%" />
    <img src="docs/quiz_false.png" width="22%" />
    <img src="docs/result.png" width="22%" />
    <img src="docs/quiz_history.png" width="22%" />
</div>

---

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** e **MVVM**, garantindo separação clara de responsabilidades.

**Presentation** (Compose UI + ViewModels)  
↓  
**Domain** (UseCases + Domain Models)  
↓  
**Data** (Repository → Local/Remote DataSources)  
↓  
**Infrastructure** (Room + Retrofit)

### 📚 Principais Tecnologias

- **Kotlin**, **Coroutines** e **Flow**
- **Jetpack Compose** (Material 3)
- **Hilt** para Injeção de Dependência
- **Room Database**
- **Retrofit + OkHttp**
- **Jetpack Navigation**
- **JUnit + MockK**

---

## 🧪 Qualidade e Testes

O projeto possui uma cobertura robusta de testes automatizados:

- **Testes Unitários:** Cobrindo 100% dos UseCases, Repositórios e ViewModels (verificando lógica de
  sucesso, erro, delays e transformação de dados).
- **Testes de Integração:** Verificação do `ScoreDao` com banco de dados em memória.
- **Testes Instrumentados (UI):** Verificação de exibição de elementos na `WelcomeScreen`.

### Como executar os testes

```bash
./gradlew test             # Roda todos os testes unitários
./gradlew connectedAndroidTest  # Roda testes de UI/Integração no emulador
```

## 📝 Assumptions (Premissas Técnicas)

1.  **A API pode repetir perguntas:** Foi implementado um sistema de retry no `GetNewQuestionUseCase` para evitar duplicações na mesma sessão.
2.  **A API pode ter lentidão (Cold Start):** Foram configurados timeouts estendidos (30s) no OkHttp para garantir a conexão inicial.
3.  **Tratamento de Erros:** Como os códigos de erro do backend não são detalhados, aplicou-se um tratamento seguro e genérico, com fallback para mensagens locais adequadas.
4.  **Jogadores:** Como não há endpoint para registrar jogadores no servidor, os nomes são armazenados e persistidos somente no banco de dados local (Room).

---

## 🔧 Como rodar o projeto

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/andrebritovita/developer-challenges.git](https://github.com/andrebritovita/developer-challenges.git)
    ```

2.  Abra o **Android Studio** (Recomendado: Ladybug ou superior).
3.  Selecione **"Open"** e navegue até a pasta **`QuizApp`** dentro do diretório clonado (`developer-challenges/QuizApp`).
4.  Aguarde o sincronismo do Gradle.
5.  Selecione um dispositivo físico ou emulador (**Min SDK 24**).
6.  Clique em **Run** ▶️.

---
*Autor: André Brito Vita*