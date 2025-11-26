# Dynamox Android Developer Challenge – Quiz App

This repository contains an implementation of the **Dynamox Android Developer Challenge**:
a Quiz application built with **Kotlin**, **Jetpack Compose**, **Hilt**, **Room** and **Retrofit**.

## Architecture

The project follows a layered architecture:

- **data**: DTOs, Room entities, DAOs, Retrofit API and repository implementation.
- **domain**: pure Kotlin models, repository interface and use cases.
- **presentation**: Jetpack Compose screens + ViewModels (MVVM).
- **di**: Hilt modules for Network, Database and Repository / UseCases.

### Layers

- `data.remote`  
  - `QuizApi` uses Retrofit to call:
    - `GET /question`
    - `POST /answer?questionId={id}`
- `data.local`
  - `AppDatabase`, `QuizDao`, `PlayerEntity`, `ScoreEntity` using Room.
- `data.repository`
  - `QuizRepositoryImpl` combines **remote API** and **local persistence**.
- `domain.model`
  - `Question`, `AnswerResult`, `Score`.
- `domain.usecase`
  - `GetQuestionUseCase`
  - `SubmitAnswerUseCase`
  - `SaveScoreUseCase`
  - `GetScoresUseCase`
- `presentation`
  - `WelcomeScreen`: user enters name/nickname.
  - `QuizScreen`: shows questions, options, and immediate feedback.
  - `ResultScreen`: shows final score and players' scores history.
  - `QuizViewModel`, `ResultViewModel` using Kotlin Flow and Coroutines.
- `di`
  - `NetworkModule`: Retrofit + OkHttp.
  - `DatabaseModule`: Room database.
  - `RepositoryModule`: repository and use cases bindings.

## User Stories Mapping

### 1 - Quiz visualization and answer submission

- **Load question**: `QuizViewModel` calls `GetQuestionUseCase` which uses `QuizRepository.getQuestion()` → `QuizApi.getQuestion()`.
- **Submit answer and know result**: `QuizViewModel.submitAnswer()` calls `SubmitAnswerUseCase` →
  `QuizRepository.submitAnswer()` which hits `POST /answer` and returns `AnswerResult`.  
  The UI displays feedback: "Correct!" or "Wrong answer".

### 2 - Quiz navigation

- **Next question after result**:  
  `QuizViewModel.submitAnswer()` increments `questionIndex` and, if `< 10`, calls `loadNextQuestion()`.
- **Final score after 10 answers**:  
  When `questionIndex` reaches 10, `SaveScoreUseCase` persists the score and
  the navigation moves to `ResultScreen`.
- **Restart quiz**:  
  `ResultScreen` has a **Restart** button that navigates back to `WelcomeScreen`.

### 3 - User management

- **Register name/nickname**:  
  `WelcomeScreen` asks for a name and passes it through navigation to `QuizScreen`.
- **Save every quiz score**:  
  `SaveScoreUseCase` stores each quiz result using `QuizRepository.saveScore()`
  → `QuizDao.insertPlayer()` and `QuizDao.insertScore()`.
- **Visualize scores of every user**:  
  `ResultViewModel` uses `GetScoresUseCase` + `QuizDao.observeScores()` (Flow) to show a list of scores
  in `ResultScreen`.

## Mandatory Technical Requirements

- **Kotlin**: Entire codebase is written in Kotlin.
- **Data persistence**:  
  `Room` is used to persist players and scores.
- **Jetpack Compose**:  
  All screens (`WelcomeScreen`, `QuizScreen`, `ResultScreen`) are built with Compose.
- **Unit tests**:  
  Example tests are provided:
  - `GetQuestionUseCaseTest`
  - `QuizViewModelTest`

## Bonus Points – How they are addressed

- **Dependency Injection**:  
  Hilt is used (`@HiltAndroidApp`, modules in `di` package).
- **Kotlin Flow/Coroutines**:  
  - `ResultViewModel` uses Flow (`StateFlow<List<Score>>`).
  - `QuizViewModel` uses Coroutines + `StateFlow<QuizUiState>`.
- **Layers of responsibility**:  
  Clear `data` / `domain` / `presentation` separation.
- **Design pattern**:  
  - Repository pattern, Use Case pattern, MVVM.
- **Error handling**:  
  - Errors during network calls are captured in `QuizViewModel` and exposed via `errorMessage` in `QuizUiState`.

## How to Run the Project

1. Open Android Studio (Giraffe or newer).
2. Select **Open an existing project** and choose the folder containing this `README.md`.
3. Let Gradle sync.
4. Connect an emulator or device.
5. Run the `app` configuration.

The app will open on the **Welcome** screen:
- Enter a name.
- Start the quiz.
- Answer 10 questions.
- See your final score and the scores history.

## How to Run Tests

- From Android Studio:
  - Right-click the `test` package → **Run tests**.
- Or using Gradle:
  - `./gradlew test`

## Assumptions

- The API always returns valid `Question` objects.
- The quiz consists of exactly **10** questions per run.
- Network errors are shown as generic messages and the user can retry.
- Scores are stored locally on the device using Room.

## Possible Improvements

- Add more polished Material3 theming and typography.
- Add instrumented UI tests with Espresso / Compose Testing.
- Handle specific HTTP errors (400 / 404 / 500) with custom messages.
- Add localization support (English / Portuguese).
