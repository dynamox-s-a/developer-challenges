# Quiz

Quiz app for the Dynamox challenge, written in Kotlin with Compose Multiplatform (Android and iOS).

You register a name, answer 10 questions from the quiz API and see right away if each answer was right. At the end you get your score, which is saved on the device and listed on a scoreboard. There is also a settings page to switch the interface between English and Portuguese, and the app follows the system light/dark theme.

## Running it

You need JDK 21 and Android Studio with the Android SDK. Open the project, run the `androidApp` configuration, or build from the terminal:

```sh
./gradlew :androidApp:assembleDebug
```

For iOS, open `iosApp/iosApp.xcodeproj` in Xcode (macOS only).

I ran the Android app on a Moto G54 (Android 15) and on an emulator. For iOS I could only check that the shared code and the iOS specific code compile for device and simulator (`./gradlew :shared:compileKotlinIosArm64 :shared:compileKotlinIosSimulatorArm64`). Linking and running it needs Xcode on a Mac, which I did not have, so the iOS app itself has not been run.

## Tests

```sh
./gradlew :shared:testAndroidHostTest
```

They cover the domain rules, the data layer (HTTP client, error mapping, SQL against an in-memory database), every ViewModel, the Koin graph and the Compose screens (Robolectric, so no device is needed). One integration test plays a whole quiz through the real ViewModels, HTTP client (mock engine) and database, and the UI tests do the same through the screens, including failure paths. Line coverage is around 98%.

## How it's organized

Everything lives in `shared/` and follows `presentation -> domain <- data`. The domain layer has no framework code, so it is easy to test.

- `domain`: models, repository interfaces and two use cases (name validation and loading a question)
- `data`: Ktor for the API, SQLDelight for players, scores and settings
- `presentation`: ViewModels with a single `StateFlow` of UI state, Compose screens, navigation, strings and theme
- `di`: Koin modules. Android and iOS only provide the HTTP engine and the SQLite driver

Errors from the API become `NoConnection`, `Server(code)` or `Unknown` and the UI shows a message with a retry button.

## Decisions

- Names are trimmed and limited to 20 characters. The same name in a different case is the same player (SQLite only folds the case of plain ASCII letters).
- The name field keeps the last name typed, so a returning player does not have to type it again.
- The server picks questions at random and can repeat one, so the app asks again (up to 5 times) to avoid repeats in a quiz.
- The score is saved as soon as the 10th answer arrives.
- The API only says if an answer was correct, so after a wrong answer the app marks your choice but can't show the right one.
- Only the app interface is translated. Questions are shown as the server sends them.
- The quiz server can take around 10 seconds to answer the first request after being idle, so the HTTP client waits up to 30 seconds before giving up.
- The quiz API answers `/question` with the content type `text/application-json`, which Ktor does not know, so the client is set up to read it as JSON.
