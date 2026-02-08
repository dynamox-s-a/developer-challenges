# Quiz Application - Kotlin Multiplatform

Aplicação de quiz multiplataforma (Android/iOS) desenvolvida com **Kotlin Multiplatform** seguindo princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)**.

## Objetivo

Resposta ao desafio técnico Dynamox:
- Quiz com 10 perguntas de múltipla escolha
- Sistema de pontuação e histórico
- Múltiplos jogadores
- Persistência de sessão (retomar quiz em andamento)
- Interface Android (obrigatório) e iOS (bonus)

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
│   Infrastructure        │  ← API, DB, etc
└─────────────────────────┘
```

Dependências apontam para dentro. Core não conhece frameworks.

## Estrutura

```
src/
├── commonMain/kotlin/org/kaelkill/quiz/
│   └── domain/              # Core
├── commonTest/kotlin/org/kaelkill/quiz/
│   └── domain/              # Testes
├── androidMain/             # Android
└── iosMain/                 # iOS
```

## Executar

### Testes
```bash
./gradlew test
```

### Android
```bash
./gradlew installDebug
```

## Documentação

- [DOMAIN_MODEL.md](docs/DOMAIN_MODEL.md) — Modelagem do domínio