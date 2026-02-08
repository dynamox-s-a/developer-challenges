package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class FillSessionUseCaseTest {

    private val player = PlayerName.create("Player").getOrThrow()

    private fun createQuestion(id: String) = Question.create(
        id = id,
        statement = "Statement $id",
        options = listOf("A", "B", "C", "D", "E")
    ).getOrThrow()

    @Test
    fun `should fill session until it has 10 questions`() = runTest {
        val session = QuizSession.create(player)
        val sessionRepo = FakeSessionRepository(session)

        val questionRepo = GeneratorQuestionRepository()

        val useCase = FillSessionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(session.id.value)

        assertTrue(result.isSuccess)

        val finalSession = sessionRepo.getById(session.id).getOrThrow()
        assertEquals(10, finalSession.questions.size)

        assertEquals("q0", finalSession.questions.first().id.value)
        assertEquals("q9", finalSession.questions.last().id.value)
    }

    @Test
    fun `should stop filling if api fails repeatedly`() = runTest {
        val session = QuizSession.create(player)
        val sessionRepo = FakeSessionRepository(session)

        val questionRepo = FlakyQuestionRepository(successCount = 2)

        val useCase = FillSessionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(session.id.value)

        assertTrue(result.isFailure)
        assertEquals("Failed to fill session fully", result.exceptionOrNull()?.message)

        val finalSession = sessionRepo.getById(session.id).getOrThrow()
        assertEquals(2, finalSession.questions.size)
    }


    class FakeSessionRepository(initialSession: QuizSession) : QuizSessionRepository {
        private var currentSession = initialSession

        override suspend fun save(session: QuizSession): Result<Unit> {
            currentSession = session
            return Result.success(Unit)
        }

        override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
            return Result.success(currentSession)
        }
    }

    class GeneratorQuestionRepository : QuestionRepository {
        private var counter = 0
        override suspend fun getRandomQuestion(): Result<Question> {
            val q = Question.create("q$counter", "S", listOf("A","B","C","D","E")).getOrThrow()
            counter++
            return Result.success(q)
        }
        override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> = Result.success(true)
    }

    class FlakyQuestionRepository(private val successCount: Int) : QuestionRepository {
        private var counter = 0
        override suspend fun getRandomQuestion(): Result<Question> {
            if (counter >= successCount) return Result.failure(Exception("Network Error"))
            val q = Question.create("q$counter", "S", listOf("A","B","C","D","E")).getOrThrow()
            counter++
            return Result.success(q)
        }
        override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> = Result.success(true)
    }
}