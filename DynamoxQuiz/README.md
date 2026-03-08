DynamoxQuiz — iOS Developer Challenge

Sobre o Projeto
Aplicativo de Quiz iOS desenvolvido como solução ao Dynamox iOS Developer Challenge. 
O app permite que o usuário informe seu nome, responda 10 perguntas de múltipla escolha obtidas via API, visualize o resultado ao final e consulte o histórico de partidas.

## Screenshots

<p float="left">
  <img src="https://github.com/user-attachments/assets/e2ecc649-b23f-4a5b-8f10-ae8c11ae836d" width="180"/>
  <img src="https://github.com/user-attachments/assets/036a9053-d641-4c9f-adae-0a59134c7247" width="180"/>
  <img src="https://github.com/user-attachments/assets/a3f86f27-c9a0-416d-9fc1-b61879e9ed0e" width="180"/>
  <img src="https://github.com/user-attachments/assets/3204d05f-5755-4abf-8443-326d93430965" width="180"/>
  <img src="https://github.com/user-attachments/assets/3324cdaf-c016-4c4f-ba35-3750cace3da1" width="180"/>
</p>

Tecnologias Utilizadas

Swift 6
UIKit — telas de Splash e Quiz
SwiftUI — tela de Perfil
CocoaPods — gerenciamento de dependências
Alamofire — requisições HTTP
Core Data — persistência local de partidas e usuário
XCTest — testes unitários


## Arquitetura

O projeto utiliza o padrão **MVVMC (Model-View-ViewModel-Coordinator)**:
```
DynamoxQuiz/
├── App/                    # AppDelegate, SceneDelegate
├── Components/             # Componentes reutilizáveis de UI
├── Coordinators/           # Gerenciamento de navegação
├── Core/
│   ├── Constants/          # Cores e constantes
│   ├── Network/            # APIService e protocolo APIServiceDelegate
│   └── Persistence/        # CoreDataStack e Repositories
├── Models/                 # Question, AnswerResponse, QuizState
├── Views/
│   ├── Splash/             # Tela inicial (UIKit)
│   ├── Quiz/               # Tela do quiz (UIKit)
│   └── Home/               # Tela de perfil (SwiftUI)
└── ViewsModels/            # ViewModels por tela
```

Decisões Técnicas

Tive o MVVM-C como escolha para separar claramente a lógica de negócio da UI e da navegação, facilitando testes e manutenção.
Dependency Injection via init em todos os ViewModels e Repositories, permitindo o uso de Mocks nos testes.
Async/Await para todas as operações assíncronas de rede.
Protocolo APIServiceDelegate criado para desacoplar o ViewModel da implementação concreta do serviço, viabilizando testes sem chamadas reais de rede.
FileManager para persistência da foto de perfil — preferido ao UserDefaults por ser mais adequado para dados binários.


Funcionalidades

 Registro de nome/apelido do usuário
 Carregamento de perguntas via API (GET /question)
 Submissão de resposta e feedback imediato (POST /answer)
 Navegação entre as 10 perguntas
 Exibição do score final com opção de reiniciar
 Persistência de partidas com Core Data
 Histórico de partidas por usuário
 Foto de perfil com PhotosPicker + FileManager
 Testes unitários do QuizViewModel


Os testes cobrem a camada de maior risco e complexidade do negócio — o `QuizViewModel`. Utilizando **XCTest** com o padrão **AAA (Arrange, Act, Assert)** e Mocks para isolar dependências externas.

```
DynamoxQuizTests/
├── Mocks/
│   └── MockAPIService.swift         # Mock do APIService para isolar rede
└── ViewModels/
    ├── NextQuestionTest.swift        # Testa incremento do índice
    ├── ResetQuizTest.swift           # Testa reset de estado
    └── LoadQuestionQuizTest.swift    # Testa carregamento de pergunta com Mock
```
    
Casos testados

test_quizViewModel_nextQuestion_sumNumberQuestion | Ao chamar nextQuestion(), o currentIndex deve incrementar em 1 |
test_quizViewModel_resetQuiz_deveZerarCurrentIndex | Após resetQuiz(), o currentIndex deve ser 0 |
test_quizViewModel_resetQuiz_deveZerarCorrectAnswerCount | Após resetQuiz(), o correctAnswerCount deve ser 0 |
test_quizViewModel_resetQuiz_deveZerarCurrentQuestion | Após resetQuiz(), o currentQuestion deve ser nil |
test_quizViewModel_resetQuiz_resetStateEqualQuiz | Após resetQuiz(), o state deve ser .quiz |
test_quizViewmodel_loadQuestionQuiz_shouldLoadQuestion | Ao carregar uma pergunta via Mock, currentQuestion não deve ser nil |

Para rodar os testes: ⌘ + U no Xcode.

Como Rodar o Projeto

Requisitos:

Xcode 15+
iOS 16+
CocoaPods instalado

Instalação
```
Clone o repositório
git clone https://github.com/TecoAdamo/developer-challenges.git

# Entre na branch
git checkout mateus-adamo

# Entre na pasta do projeto
cd DynamoxQuiz

# Instale as dependências
pod install

# Abra o workspace (não o .xcodeproj)
open DynamoxQuiz.xcworkspace
```

Rodando

Selecione um simulador (iPhone 16 recomendado)
Pressione ⌘ + R para rodar
Para rodar os testes: ⌘ + U


Dependências (Podfile)
pod 'Alamofire'

API
Base URL: https://quiz-api-bwi5hjqyaq-uc.a.run.app
MétodoEndpointDescriçãoGET/questionRetorna uma pergunta aleatóriaPOST/answer?questionId={id}Valida a resposta do usuário

Autor
Mateus Adamo
Desenvolvido como solução ao Dynamox iOS Developer Challenge — Março 2026
