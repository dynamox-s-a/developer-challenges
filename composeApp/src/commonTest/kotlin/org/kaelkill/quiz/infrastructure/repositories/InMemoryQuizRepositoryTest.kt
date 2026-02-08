package org.kaelkill.quiz.infrastructure.repositories

import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class InMemoryQuizSessionRepositoryTest {

    private fun createRepository() = InMemoryQuizSessionRepository()

    private fun createSession(): QuizSession {
        return QuizSession.create(PlayerId.generate())
    }

    @Test
    fun `should save a session`() = runTest {
        val repo = createRepository()
        val session = createSession()

        val result = repo.save(session)

        assertTrue(result.isSuccess)
    }

    @Test
    fun `should find session by id after saving`() = runTest {
        val repo = createRepository()
        val session = createSession()
        repo.save(session)

        val result = repo.getById(session.id)

        assertTrue(result.isSuccess)
        assertEquals(session.id, result.getOrThrow().id)
    }

    @Test
    fun `should fail when session not found by id`() = runTest {
        val repo = createRepository()
        val fakeId = QuizSessionId.generate()

        val result = repo.getById(fakeId)

        assertTrue(result.isFailure)
    }

    @Test
    fun `should overwrite session with same id on save`() = runTest {
        val repo = createRepository()
        val session = createSession()
        repo.save(session)
        repo.save(session)

        val result = repo.getById(session.id)

        assertTrue(result.isSuccess)
    }
}