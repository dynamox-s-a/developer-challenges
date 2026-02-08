package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Answer
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.AnswerOption
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AnswerQuestionUseCaseTest {

    private val question1 = Question.create("q1", "Statement 1", listOf("A", "B", "C", "D", "E" )).getOrThrow()
    private val player = PlayerName.create("Player").getOrThrow()

    @Test
    fun `should answer correctly updates score and saves session`() = runTest {
        val initialSession = QuizSession.create(player).addNewQuestion(question1).getOrThrow()

        val sessionRepo = FakeQuizSessionRepository()
        sessionRepo.save(initialSession)
        val questionRepo = FakeQuestionRepository(isAnswerCorrect = true)
        val useCase = AnswerQuestionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(
            sessionIdStr = initialSession.id.value,
            questionIdStr = "q1",
            answerStr = "A"
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()

        assertEquals(1, updatedSession.score)
        assertEquals(1, updatedSession.answers.size)
        assertEquals("A", updatedSession.answers.first().selectedOption.value)
        assertTrue(sessionRepo.wasSaveCalled)
    }

    @Test
    fun `should answer incorrectly updates history but not score`() = runTest {
        val initialSession = QuizSession.create(player).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository()
        sessionRepo.save(initialSession)

        val questionRepo = FakeQuestionRepository(isAnswerCorrect = false)
        val useCase = AnswerQuestionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute(
            sessionIdStr = initialSession.id.value,
            questionIdStr = "q1",
            answerStr = "B"
        )

        assertTrue(result.isSuccess)
        val updatedSession = result.getOrThrow()
        assertEquals(0, updatedSession.score)
        assertEquals(1, updatedSession.answers.size)
        assertTrue(sessionRepo.wasSaveCalled)
    }

    @Test
    fun `should fail if session does not exist`() = runTest {
        val sessionRepo = FakeQuizSessionRepository()
        val questionRepo = FakeQuestionRepository(isAnswerCorrect = true)
        val useCase = AnswerQuestionUseCase(sessionRepo, questionRepo)

        val result = useCase.execute("non-existent-id", "q1", "A")

        assertTrue(result.isFailure)
        assertEquals("Session not found", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if question is not in session`() = runTest {
        val initialSession = QuizSession.create(player).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository()
        sessionRepo.save(initialSession)

        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute(initialSession.id.value, "q99", "A")

        assertTrue(result.isFailure)
        assertEquals("Question not found in current session", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if question already answered`() = runTest {
        var session = QuizSession.create(player).addNewQuestion(question1).getOrThrow()

        val option = AnswerOption.create("A").getOrThrow()
        val answer = Answer(question1.id, option)
        session = session.copy(answers = listOf(answer))

        val sessionRepo = FakeQuizSessionRepository()
        sessionRepo.save(session)

        val useCase = AnswerQuestionUseCase(sessionRepo, FakeQuestionRepository(true))

        val result = useCase.execute(session.id.value, "q1", "B")

        assertTrue(result.isFailure)
        assertEquals("Question already answered", result.exceptionOrNull()?.message)
    }

    @Test
    fun `should fail if api check fails`() = runTest {
        val initialSession = QuizSession.create(player).addNewQuestion(question1).getOrThrow()
        val sessionRepo = FakeQuizSessionRepository()
        sessionRepo.save(initialSession)

        val brokenRepo = object : QuestionRepository {
            override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> {
                return Result.failure(Exception("Network Error"))
            }
            override suspend fun getRandomQuestion(): Result<Question> = Result.failure(Exception(""))
        }

        val useCase = AnswerQuestionUseCase(sessionRepo, brokenRepo)

        val result = useCase.execute(initialSession.id.value, "q1", "A")

        assertTrue(result.isFailure)
        assertEquals("Network Error", result.exceptionOrNull()?.message)
    }

    class FakeQuizSessionRepository : QuizSessionRepository {
        private val storage = mutableMapOf<String, QuizSession>()
        var wasSaveCalled = false

        override suspend fun save(session: QuizSession): Result<Unit> {
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