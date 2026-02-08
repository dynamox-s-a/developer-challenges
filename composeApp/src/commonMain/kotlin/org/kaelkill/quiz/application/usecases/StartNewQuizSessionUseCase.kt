package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class StartNewQuizSessionUseCase(
    private val quizSessionRepository: QuizSessionRepository,
    private val registerOrLoginPlayerUseCase: RegisterOrLoginPlayerUseCase,
    private val fillSessionUseCase: FillSessionUseCase
) {
    suspend fun execute(playerName: String): Result<QuizSession> {
        return runCatching {
            val player = registerOrLoginPlayerUseCase.execute(playerName).getOrThrow()
            val session = QuizSession.create(player.id)
            quizSessionRepository.save(session).getOrThrow()
            fillSessionUseCase.execute(session.id.value).getOrThrow()
            quizSessionRepository.getById(session.id).getOrThrow()
        }
    }
}