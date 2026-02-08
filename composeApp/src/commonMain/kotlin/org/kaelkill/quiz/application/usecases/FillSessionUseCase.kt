package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class FillSessionUseCase(
    private val sessionRepository: QuizSessionRepository,
    private val questionRepository: QuestionRepository
) {
    companion object {
        private const val REQUIRED_QUESTIONS = 10
        private const val MAX_ATTEMPTS = 30
    }

    suspend fun execute(sessionIdStr: String): Result<Unit> {
        return runCatching {
            val sessionId = QuizSessionId.create(sessionIdStr).getOrThrow()

            repeat(MAX_ATTEMPTS) {
                if (isSessionFull(sessionId)) return Result.success(Unit)
                tryAddQuestion(sessionId)
            }

            throw Exception("Failed to fill session with $REQUIRED_QUESTIONS questions after $MAX_ATTEMPTS attempts")
        }
    }

    private suspend fun isSessionFull(sessionId: QuizSessionId): Boolean {
        val session = sessionRepository.getById(sessionId).getOrThrow()
        return session.questions.size >= REQUIRED_QUESTIONS
    }

    private suspend fun tryAddQuestion(sessionId: QuizSessionId) {
        val session = sessionRepository.getById(sessionId).getOrThrow()
        val question = questionRepository.getRandomQuestion().getOrNull() ?: return
        val updated = session.addNewQuestion(question).getOrNull() ?: return
        sessionRepository.save(updated).getOrThrow()
    }
}