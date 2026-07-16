# iOS Quiz Challenge

Aplicativo iOS de quiz desenvolvido em Swift para o iOS Developer Challenge.

## Requisitos

- Xcode 26 ou superior
- iOS Simulator com iOS 26 ou superior
- CocoaPods 1.17 ou superior
- Ruby disponível no ambiente local

## Como Rodar

1. Instale as dependências:

```sh
cd ios-quiz-challenge
pod install
```

2. Abra o workspace:

```sh
open ios-quiz-challenge.xcworkspace
```

3. Selecione o scheme `ios-quiz-challenge`.

4. Rode o app em um simulador iOS.

## Como Testar

Pelo Xcode, use o scheme:

- `ios-quiz-challenge-UnitTests`

## Funcionalidades

- Cadastro de nickname antes de iniciar o quiz.
- Fluxo de 10 perguntas de múltipla escolha.
- Perguntas carregadas via `GET /question`.
- Respostas validadas via `POST /answer?questionId=$id`.
- Feedback visual de resposta correta/incorreta antes da próxima pergunta.
- Timer de 120 segundos para o quiz.
- Finalização automática quando o timer chega a zero.
- Pontuação final calculada por `acertos * segundosRestantes`.
- Tela de resultado com opção de reiniciar o quiz.
- Ranking com persistência local.

## Decisões De Produto

- A persistência mantém o melhor score por nickname, em vez de armazenar todas as tentativas. Essa decisão privilegia uma experiência de ranking mais clara para o usuário.
- Os snapshot tests são unit-style, instanciando views/componentes diretamente com mocks/spies, sem navegação e2e pelo app.

## Arquitetura

O app é organizado por feature, foi decidido mante-los no target principal por questão de comodidade, mas poderia ter sido utilizada a mesma estratégia de modularização dos modulos dNetwork e DynaUI, as features mapeadas são:

- `Entry`: cadastro e carregamento do nickname.
- `Quiz`: fluxo de perguntas, respostas, timer e pontuação.
- `Result`: exibição e salvamento do resultado.
- `Ranking`: listagem dos melhores scores.
- `Shared`: componentes visuais compartilhados.

Cada feature segue uma separação de responsabilidades inspirada em VIP/Clean Architecture:

- `Configurator`: montagem da feature e injeção de dependências.
- `Interactor`: regras de negócio e orquestração de use cases.
- `Presenter`: formatação de dados para exibição.
- `Router`: navegação.
- `View/ViewState`: SwiftUI e estado observável.
- `Domain`: use cases e contratos.
- `Service`: comunicação HTTP e DTOs.

## Dependências

O projeto usa CocoaPods com pods locais:

- `DynaUI`: componentes visuais reutilizáveis.
- `dNetwork`: cliente HTTP baseado em `URLSession`.
- `dDependencies`: registro e resolução simples de dependências.

## Persistência

Os dados são persistidos com `UserDefaults` por meio de `UserDefaultsPlayerRepository`.

São armazenados:

- nickname atual;
- melhores scores por nickname.

## API

Host utilizado:

```text
https://quiz-api-bwi5hjqyaq-uc.a.run.app
```

Endpoints:

- `GET /question`
- `POST /answer?questionId=$id`

## Observações

- Para simular a tela de erro, uma forma simples é alterar temporariamente o path `question` para um endpoint inválido em `QuizService.swift`.
- Se `xcodebuild` falhar com erro de `xcode-select`, selecione uma instalação completa do Xcode:

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```
