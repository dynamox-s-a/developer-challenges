package org.kaelkill.quiz.domain.ports.repositories

import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId

interface QuizSessionRepository {
    suspend fun save(session: QuizSession): Result<Unit>
    suspend fun getById(id: QuizSessionId): Result<QuizSession>
}