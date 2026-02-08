package org.kaelkill.quiz.infrastructure.repositories

import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository

class InMemoryQuizSessionRepository : QuizSessionRepository {

    private val sessions = mutableMapOf<String, QuizSession>()

    override suspend fun save(session: QuizSession): Result<Unit> {
        return runCatching {
            sessions[session.id.value] = session
        }
    }

    override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
        return runCatching {
            sessions[id.value] ?: throw NoSuchElementException("Session not found: ${id.value}")
        }
    }
}