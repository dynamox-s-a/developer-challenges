package org.kaelkill.quiz.application.usecases

import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.valueobjects.QuestionId
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class AnswerQuestionUseCase(
    private val sessionRepository: QuizSessionRepository,
    private val questionRepository: QuestionRepository
) {
    suspend fun execute(sessionIdStr: String, questionIdStr: String, answerStr: String): Result<QuizSession> {
        val sessionIdResult = QuizSessionId.create(sessionIdStr)
        if (sessionIdResult.isFailure) return Result.failure(sessionIdResult.exceptionOrNull()!!)
        val sessionId = sessionIdResult.getOrThrow()

        val sessionResult = sessionRepository.getById(sessionId)
        if (sessionResult.isFailure) return Result.failure(sessionResult.exceptionOrNull()!!)
        val session = sessionResult.getOrThrow()

        val isCorrectResult = questionRepository.checkAnswer(questionIdStr, answerStr)
        if (isCorrectResult.isFailure) return Result.failure(isCorrectResult.exceptionOrNull()!!)
        val isCorrect = isCorrectResult.getOrThrow()

        val updateResult = session.answerQuestion(questionIdStr, answerStr, isCorrect)
        if (updateResult.isFailure) return Result.failure(updateResult.exceptionOrNull()!!)
        val updatedSession = updateResult.getOrThrow()

        val saveResult = sessionRepository.save(updatedSession)
        if (saveResult.isFailure) return Result.failure(saveResult.exceptionOrNull()!!)

        return Result.success(updatedSession)
    }
}