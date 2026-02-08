package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class FillSessionUseCaseTest {

    private val playerId = PlayerId.generate()

    @Test
    fun `should fill session until it has 10 questions`() = runTest {
        val session = QuizSession.create(playerId)
        val sessionRepo = FakeSessionRepository(session)
        val questionRepo = GeneratorQuestionRepository() // Gera q0, q1, q2...

        val useCase = FillSessionUseCase(sessionRepo, questionRepo)
        val result = useCase.execute(session.id.value)

        assertTrue(result.isSuccess)
        val finalSession = sessionRepo.getById(session.id).getOrThrow()
        assertEquals(10, finalSession.questions.size)
    }

    @Test
    fun `should fail immediately if session id format is invalid`() = runTest {
        val useCase = FillSessionUseCase(FakeSessionRepository(QuizSession.create(playerId)), GeneratorQuestionRepository())

        val result = useCase.execute("   ")

        assertTrue(result.isFailure)
    }

    @Test
    fun `should fail if repository fails to fetch session`() = runTest {
        val session = QuizSession.create(playerId)
        val sessionRepo = FakeSessionRepository(session, failOnGet = true)

        val useCase = FillSessionUseCase(sessionRepo, GeneratorQuestionRepository())
        val result = useCase.execute(session.id.value)

        assertTrue(result.isFailure)
        assertEquals("DB Error Get", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if repository fails to save session`() = runTest {
        val session = QuizSession.create(playerId)
        val sessionRepo = FakeSessionRepository(session, failOnSave = true)

        val useCase = FillSessionUseCase(sessionRepo, GeneratorQuestionRepository())
        val result = useCase.execute(session.id.value)

        assertTrue(result.isFailure)
        assertEquals("DB Error Save", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should handle duplicates correctly by ignoring them and retrying until max attempts`() = runTest {
        val session = QuizSession.create(playerId)
        val sessionRepo = FakeSessionRepository(session)

        val fixedQuestion = Question.create("q1", "S", listOf("A","B","C","D","E")).getOrThrow()
        val questionRepo = FixedQuestionRepository(fixedQuestion)

        val sessionWithDuplicate = session.addNewQuestion(fixedQuestion).getOrThrow()
        sessionRepo.save(sessionWithDuplicate)

        val useCase = FillSessionUseCase(sessionRepo, questionRepo)
        val result = useCase.execute(sessionWithDuplicate.id.value)

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is Exception)

        val finalSession = sessionRepo.getById(session.id).getOrThrow()
        assertEquals(1, finalSession.questions.size)
    }

    @Test
    fun `should fail if api fails repeatedly (network error)`() = runTest {
        val session = QuizSession.create(playerId)
        val sessionRepo = FakeSessionRepository(session)
        val questionRepo = FlakyQuestionRepository(successCount = 2)

        val useCase = FillSessionUseCase(sessionRepo, questionRepo)
        val result = useCase.execute(session.id.value)

        assertTrue(result.isFailure)
        val finalSession = sessionRepo.getById(session.id).getOrThrow()
        assertEquals(2, finalSession.questions.size)
    }

    class FakeSessionRepository(
        initialSession: QuizSession,
        private val failOnGet: Boolean = false,
        private val failOnSave: Boolean = false
    ) : QuizSessionRepository {

        private var currentSession = initialSession

        override suspend fun save(session: QuizSession): Result<Unit> {
            if (failOnSave) return Result.failure(Exception("DB Error Save"))
            currentSession = session
            return Result.success(Unit)
        }

        override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
            if (failOnGet) return Result.failure(Exception("DB Error Get"))
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

    class FixedQuestionRepository(private val question: Question) : QuestionRepository {
        override suspend fun getRandomQuestion(): Result<Question> = Result.success(question)
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