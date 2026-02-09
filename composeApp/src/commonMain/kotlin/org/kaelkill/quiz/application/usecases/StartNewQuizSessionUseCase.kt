package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class StartNewQuizSessionUseCase(
    private val quizSessionRepository: QuizSessionRepository,
    private val registerOrLoginPlayerUseCase: RegisterOrLoginPlayerUseCase,
    private val questionRepository: QuestionRepository
) {
    suspend fun execute(playerName: String): Result<QuizSession> {
        return runCatching {
            val player = registerOrLoginPlayerUseCase.execute(playerName).getOrThrow()
            var session = QuizSession.create(player.id)

            val firstQuestion = questionRepository.getRandomQuestion().getOrThrow()
            session = session.addNewQuestion(firstQuestion).getOrThrow()

            quizSessionRepository.save(session).getOrThrow()
            session
        }
    }
}