package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Answer
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.PlayerId
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class AnswerQuestionUseCaseTest {

    private val question1 = Question.create("q1", "Statement 1", listOf("A", "B", "C", "D", "E")).getOrThrow()
    private val playerId = PlayerId.generate()

    @Test
    fun `should answer correctly updates score and saves session`() = runTest {
        val initialSession = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository(initialSession)
        val questionRepo = FakeQuestionRepository(isAnswerCorrect = true)

        val useCase = AnswerQuestionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(
            sessionIdStr = initialSession.id.value,
            questionIdStr = "q1",
            answerStr = "A"
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()
        assertEquals(1, updatedSession.score.value)
        assertTrue(sessionRepo.wasSaveCalled)
    }

    @Test
    fun `should answer incorrectly updates history but not score`() = runTest {
        val initialSession = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository(initialSession)
        val questionRepo = FakeQuestionRepository(isAnswerCorrect = false)

        val useCase = AnswerQuestionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(
            sessionIdStr = initialSession.id.value,
            questionIdStr = "q1",
            answerStr = "B"
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()
        assertEquals(0, updatedSession.score.value)
        assertTrue(sessionRepo.wasSaveCalled)
    }


    @Test
    fun `should fail immediately if session ID format is invalid`() = runTest {
        val useCase = AnswerQuestionUseCase(FakeQuizSessionRepository(), FakeQuestionRepository(true))

        val result = useCase.execute("   ", "q1", "A")

        assertTrue(result.isFailure)
    }

    @Test
    fun `should fail if session does not exist in repository`() = runTest {
        val sessionRepo = FakeQuizSessionRepository(initialSession = null) // Vazio
        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute("valid-id", "q1", "A")

        assertTrue(result.isFailure)
        assertEquals("Session not found", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if api check fails (network error)`() = runTest {
        val initialSession = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository(initialSession)

        val brokenApiRepo = object : QuestionRepository {
            override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> {
                return Result.failure(Exception("Network Error"))
            }
            override suspend fun getRandomQuestion(): Result<Question> = Result.failure(Exception(""))
        }

        val useCase = AnswerQuestionUseCase(sessionRepo, brokenApiRepo)

        val result = useCase.execute(initialSession.id.value, "q1", "A")

        assertTrue(result.isFailure)
        assertEquals("Network Error", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if domain logic rejects answer (e-g question not found)`() = runTest {
        val initialSession = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository(initialSession)

        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute(initialSession.id.value, "q99", "A")

        assertTrue(result.isFailure)
        assertEquals("Question not found in current session", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if domain logic rejects answer (e-g already answered)`() = runTest {
        var session = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()
        val answer = Answer(question1.id, AnswerOption.create("A").getOrThrow())
        session = session.copy(answers = listOf(answer))

        val sessionRepo = FakeQuizSessionRepository(session)
        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute(session.id.value, "q1", "B")

        assertTrue(result.isFailure)
        assertEquals("Question already answered", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if repository fails to save the updated session`() = runTest {
        val initialSession = QuizSession.create(playerId).addNewQuestion(question1).getOrThrow()

        val sessionRepo = FakeQuizSessionRepository(initialSession, failOnSave = true)

        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute(initialSession.id.value, "q1", "A")

        assertTrue(result.isFailure)
        assertEquals("DB Save Error", result.exceptionOrNull()?.message)
    }

    class FakeQuizSessionRepository(
        initialSession: QuizSession? = null,
        private val failOnSave: Boolean = false
    ) : QuizSessionRepository {

        private val storage = mutableMapOf<String, QuizSession>()
        var wasSaveCalled = false

        init {
            if (initialSession != null) storage[initialSession.id.value] = initialSession
        }

        override suspend fun save(session: QuizSession): Result<Unit> {
            if (failOnSave) return Result.failure(Exception("DB Save Error"))

            storage[session.id.value] = session
            wasSaveCalled = true
            return Result.success(Unit)
        }

        override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
            val session = storage[id.value] ?: return Result.failure(Exception("Session not found"))
            return Result.success(session)
        }
    }

    class FakeQuestionRepository(private val isAnswerCorrect: Boolean) : QuestionRepository {
        override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> {
            return Result.success(isAnswerCorrect)
        }

        override suspend fun getRandomQuestion(): Result<Question> {
            return Result.failure(Exception("Not implemented"))
        }
    }
}