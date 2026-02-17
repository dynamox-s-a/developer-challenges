# Dynamox Android Developer Challenge

## Overview

The test consists of developing a robust and intuitive Android Quiz application in Kotlin.

The quiz is composed by a sequence of 10 multiple-choice questions. When the app opens, the user enters their name or nickname and presses a button to start the quiz. Questions must be obtained via HTTP requests and are received in JSON format as shown below.

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

Throughout the challenge, we expect you to demonstrate familiarity with the proposed technologies, apply development best practices, and showcase your problem-solving skills. **Code quality, clarity, readability, and maintainability** will be the main evaluation points.

## User Stories and Functional Requirements
Below are the functional requirements for the application. Feel free to make any assumptions you deem necessary to complete the challenge, documenting them in the README.

### 1 - Quiz visualization and answer submission
- [ ] As a user, I want to load a question with a set of alternative answers, so that I can choose the one that is right.  
- [ ] As a user, I want to choose an answer for a question from a set of alternatives and submit it, so that I can know if I made the right choice.

### 2 - Quiz navigation
- [ ] As a user, I want to move to the next question once I have received the result of my answer submission, so that I can get to the end of the quiz.
- [ ] As a user, I want to know the final score for the quiz once I have submitted 10 answers, so that I could share it with friends
- [ ] As a user I want to restart the quiz with new questions, so that I could get a new score

### 3 - User management
- [ ] As a user, I want to register my name or nickname, so that different users could use the app
- [ ] As a user, I want to save the score of every quiz I made, so that I can visualize the score of every user at all times

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

## Mandatory Technical Requirements

- [ ] The application must be written in **Kotlin**
- [ ] Use a data persistence mechanism to store players and scores
- [ ] Use Jetpack Compose for the views
- [ ] Ensure correct business logic and behavior with automated unit tests.

---

## Bonus Points (Optional Requirements)
These items (1 to 3) are not mandatory, but implementing them will significantly enhance the quality of your evaluation.

### 1 - Best Practices & Architecture
- [ ] Use **Dependency Injection** to manage the application's dependencies.
- [ ] Use **Kotlin Flow/Coroutines** for asynchronous operations.
- [ ] Use consistent design, animations, icons, etc.
- [ ] Divide the solution into **layers of responsibility** (e.g., Api, Application, Domain, Infrastructure). 
- [ ] Implement some design pattern.  
- [ ] Implement **consistent error handling**, with appropriate HTTP status codes (e.g., `400` for validation, `404` for not found, `500` for unexpected errors).  

### 2 - Quality & DevOps
- [ ] Write **integration tests** for the main business logic.
- [ ] Create a **README.md** file with clear instructions to run the project locally (either with Docker or manually).

---

## Evaluation Criteria

- Technical capability
- Android knowledge
- Project and code architecture
- Code reuse
- Code readability
- Commit history

## Submission Instructions
1. **Fork** this repository to your personal GitHub account.  
2. Create a new **branch** from `main` with your name (e.g., `firstname-lastname`).  
3. After completing the challenge, open a **Pull Request** from your branch to the original repository's `main` branch.  
4. Our team will be notified, review your solution, and get in touch with you. 