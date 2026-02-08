package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class FillSessionUseCase(
    private val sessionRepository: QuizSessionRepository,
    private val questionRepository: QuestionRepository
) {

    suspend fun execute(sessionIdStr: String): Result<Unit> {
        val sessionIdResult = QuizSessionId.create(sessionIdStr)
        if (sessionIdResult.isFailure) return Result.failure(sessionIdResult.exceptionOrNull()!!)
        val sessionId = sessionIdResult.getOrThrow()

        var safetyCounter = 0
        val maxAttempts = 30

        while (safetyCounter < maxAttempts) {
            val sessionResult = sessionRepository.getById(sessionId)
            if (sessionResult.isFailure) return Result.failure(sessionResult.exceptionOrNull()!!)
            var session = sessionResult.getOrThrow()

            if (session.questions.size >= 10) {
                return Result.success(Unit)
            }

            val questionResult = questionRepository.getRandomQuestion()

            if (questionResult.isSuccess) {
                val question = questionResult.getOrThrow()

                val addResult = session.addNewQuestion(question)

                if (addResult.isSuccess) {
                    session = addResult.getOrThrow()

                    val saveResult = sessionRepository.save(session)
                    if (saveResult.isFailure) return Result.failure(saveResult.exceptionOrNull()!!)
                }
            }

            safetyCounter++
        }

        return Result.failure(Exception("Failed to fill session fully"))
    }
}