# Quiz Application - Kotlin Multiplatform

Aplicação de quiz multiplataforma (Android/iOS) desenvolvida com **Kotlin Multiplatform** seguindo princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)**.

## Objetivo

Resposta ao desafio técnico Dynamox:
- Quiz com 10 perguntas de múltipla escolha
- Sistema de pontuação e histórico
- Múltiplos jogadores
- Persistência de sessão e scores (SQLDelight)
- Interface Android (Jetpack Compose) e iOS (SwiftUI + Compose Multiplatform)

## Abordagem

### TDD

Todo código é desenvolvido test-first, seguindo o ciclo red-green-refactor.

### Arquitetura

```
┌─────────────────────────┐
│     UI (Compose)        │  ← Android/iOS
├─────────────────────────┤
│   Use Cases             │  ← Orquestração
├─────────────────────────┤
│   Domain (Core)         │  ← Regras de negócio
├─────────────────────────┤
│   Infrastructure        │  ← API, DB (SQLDelight)
└─────────────────────────┘
```

Dependências apontam para dentro. Core não conhece frameworks.

## Estrutura

```
src/
├── commonMain/kotlin/org/kaelkill/quiz/
│   ├── domain/              # Core (Value Objects, Entities, Aggregates, Ports)
│   ├── application/         # Use Cases
│   ├── infrastructure/      # Repositories (SQLDelight, HTTP)
│   ├── di/                  # Dependency Injection (Koin)
│   └── ui/                  # Screens + ViewModel
├── commonTest/              # Testes unitários e de integração
├── androidMain/             # Android (Driver SQLite, MainActivity)
└── iosMain/                 # iOS (Driver nativo, MainViewController)
```

## Executar

### Testes (local)
```bash
./gradlew test
```

### Testes (Docker)
```bash
docker build -t quiz-app .
docker run quiz-app
```

### Android
```bash
./gradlew installDebug
```

### iOS
1. Abrir o projeto no Xcode: `iosApp/iosApp.xcodeproj`
2. Selecionar um simulador ou dispositivo
3. Build and Run (⌘R)

> O `initKoin()` deve ser chamado no `iOSApp.swift` antes de criar o `MainViewController`.

## Premissas

- A API de perguntas (`quiz-api-bwi5hjqyaq-uc.a.run.app`) está disponível e retorna JSON válido
- Perguntas possuem exatamente 5 alternativas
- Scores são persistidos localmente via SQLDelight (não há backend de persistência)
- Nomes de jogadores são únicos (case-sensitive)

## Screenshots

### Android

| Login | Loading | Pergunta |
|-------|---------|----------|
| ![Login](docs/screenshots/android/aquizstart.jpg) | ![Loading](docs/screenshots/android/aquizloading.jpg) | ![Pergunta](docs/screenshots/android/aquizquestion.jpg) |

| Resposta | Resultado | Histórico |
|----------|-----------|-----------|
| ![Resposta](docs/screenshots/android/aquizanswer.jpg) | ![Resultado](docs/screenshots/android/aquizfinish.jpg) | ![Histórico](docs/screenshots/android/aquizhistory.jpg) |

### iOS

| Login | Loading | Pergunta |
|-------|---------|----------|
| ![Login](docs/screenshots/ios/quiz_start.png) | ![Loading](docs/screenshots/ios/quiz_loading.png) | ![Pergunta](docs/screenshots/ios/quiz_question.png) |

| Resposta | Resultado | Histórico |
|----------|-----------|-----------|
| ![Resposta](docs/screenshots/ios/quiz_answer.png) | ![Resultado](docs/screenshots/ios/quiz_finish.png) | ![Histórico](docs/screenshots/ios/quiz_history.png) |

## Documentação

- [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) — Modelagem do domínio