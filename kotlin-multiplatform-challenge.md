# Kotlin Multiplatform Technical Test

## Overview

The test consists of developing a multiplatform (Android and iOS) Quiz app in Kotlin.

The quiz consists of a sequence of 10 multiple-choice questions. When the app opens, the user enters their name or nickname and presses a button to start the quiz. Questions must are obtained via HTTP requests and are received in JSON format as shown below.

```json
{
  "id": "22",
  "statement": "What is the name of the coolest company in the world?",
  "options": [
    "Google",
    "Microsoft",
    "Dynamox",
    "Spotify",
    "Amazon"
  ]
}
```

The response to each question is checked via an HTTP POST request. The server returns whether the answer was correct or not sending true or false in JSON format as shown below.

```json
{
  "result": true
}
```

The users of the app should know whether they got the question right before moving on to the next one. At the end of the 10 questions, the app should display the user's score and offer an option to restart the quiz.

## Backend API

- Backend host: https://quiz-api-bwi5hjqyaq-uc.a.run.app

### GET /question

Use this endpoint to obtain a random question from the server. It returns a response in the following format:

```json
{
  "id": "22",
  "statement": "What is the name of the coolest company in the world?",
  "options": [
    "Google",
    "Microsoft",
    "Dynamox",
    "Spotify",
    "Amazon"
  ]
}
```

### POST /answer?questionId=$id

Use this endpoint to check whether the user's answer is correct. The POST body must contain the user's answer in the following format:

```json
{
  "answer": "Dynamox"
}
```

The server will return:

```json
{
  "result": true
}
```

## Evaluation Criteria

- Technical capability
- Android knowledge
- Project and code architecture
- Code reuse
- Code readability
- Commit history

## Bonus Points

- Kotlin Flow/Coroutines
- Dependency injection
- Tests
- Jetpack Compose
- Error handling
- Local database to store players
- Consistent design, animations, icons, etc.