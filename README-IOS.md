# Dynamox Quiz Challenge (iOS)

Built by **Hyago Henrique**  
LinkedIn: https://www.linkedin.com/in/hyagohlm/

A SwiftUI quiz app that fetches questions from a backend, submits answers, shows feedback (correct/incorrect), and stores match results locally using SwiftData.

---

## Features

- **SwiftUI + MVVM**
- **Async/Await** networking
- **HTTP API**
  - `GET /question` → fetch 1 random question
  - `POST /answer?questionId=<id>` with body `{ "answer": "<option>" }` → returns `{ "result": true/false }`
- **Progress + feedback**
  - Simple loading overlay while fetching/submitting
  - Feedback banner after each answer (correct/incorrect)
- **NavigationStack**
  - Name entry → Quiz → Match Result
  - Results screen can restart the quiz using the last username (without stacking extra Quiz screens)
- **SwiftData persistence**
  - Stores match results (username, score, date)
  - Results screen lists previous matches and can reset history
- **Unit tests with Swift Testing**
  - ViewModel tests using mocks (no real network/database)

---

## Requirements

- **Xcode 26.0+** (recommended for Swift Testing)
- **Minimum iOS version:** **26.2**
- Swift 5.9+ / Swift 6 mode supported

---

## Project Structure (MVVM)

## Possible Improvements

 - Add UI tests

 - Improve error messages by decoding backend error bodies

 - Add accessibility improvements (VoiceOver, dynamic type)

 - Add option to share a screenshot of ranking with friends.



## How to Run

1. Clone the repository

2. Open the project in Xcode - > dynamoxQuizChallenge.xcodeproj

3. Select a simulator (e.g. iPhone 17) and run: Press Run (⌘R)

The app starts on the name entry screen. Enter a username and press Start Quiz.
