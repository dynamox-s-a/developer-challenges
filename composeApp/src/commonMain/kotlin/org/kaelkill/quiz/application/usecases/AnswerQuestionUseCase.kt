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
        return runCatching {

        val sessionId = QuizSessionId.create(sessionIdStr).getOrThrow()
        val session = sessionRepository.getById(sessionId).getOrThrow()
        val isCorrect = questionRepository.checkAnswer(questionIdStr, answerStr).getOrThrow()
        val updatedSession = session.answerQuestion(questionIdStr, answerStr, isCorrect).getOrThrow()

        sessionRepository.save(updatedSession).getOrThrow()

        updatedSession
        }
    }
}
