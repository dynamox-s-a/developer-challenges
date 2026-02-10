package org.kaelkill.quiz.application.usecases

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.kaelkill.quiz.domain.model.aggregates.QuizSession
import org.kaelkill.quiz.domain.model.entities.Player
import org.kaelkill.quiz.domain.model.entities.Question
import org.kaelkill.quiz.domain.model.valueobjects.PlayerName
import org.kaelkill.quiz.domain.model.valueobjects.QuizSessionId
import org.kaelkill.quiz.domain.ports.repositories.PlayerRepository
import org.kaelkill.quiz.domain.ports.repositories.QuestionRepository
import org.kaelkill.quiz.domain.ports.repositories.QuizSessionRepository
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class StartNewQuizSessionUseCaseTest {

    @Test
    fun `should create session with AT LEAST ONE question initially`() = runTest {
        val sessionRepo = FakeQuizSessionRepository()
        val playerRepo = FakePlayerRepository()
        val questionRepo = GeneratorQuestionRepository()

        val startSessionUseCase = makeSUT(sessionRepo, playerRepo, questionRepo)

        val result = startSessionUseCase.execute("John")

        assertTrue(result.isSuccess)
        val session = result.getOrThrow()

        assertTrue(session.playerId.value.isNotEmpty())
        assertEquals(1, session.questions.size)
        assertTrue(sessionRepo.wasSaveCalled)
    }

    @Test
    fun `should fail if player registration fails`() = runTest {
        val playerRepo = FakePlayerRepository(failOnSave = true)
        val startSessionUseCase = makeSUT(FakeQuizSessionRepository(), playerRepo, GeneratorQuestionRepository())

        val result = startSessionUseCase.execute("John")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is Exception)
    }

    @Test
    fun `should fail if saving the session fails`() = runTest {
        val sessionRepo = FakeQuizSessionRepository(failOnSave = true)
        val startSessionUseCase = makeSUT(sessionRepo, FakePlayerRepository(), GeneratorQuestionRepository())

        val result = startSessionUseCase.execute("John")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is Exception)
    }

    @Test
    fun `should fail if fetching first question fails`() = runTest {
        val questionRepo = GeneratorQuestionRepository(failOnGet = true)
        val startSessionUseCase = makeSUT(FakeQuizSessionRepository(), FakePlayerRepository(), questionRepo)

        val result = startSessionUseCase.execute("John")

        assertTrue(result.isFailure)
        assertTrue(result.exceptionOrNull() is Exception)
    }

    private fun makeSUT(
        sessionRepo: QuizSessionRepository,
        playerRepo: PlayerRepository,
        questionRepo: QuestionRepository
    ): StartNewQuizSessionUseCase {
        return StartNewQuizSessionUseCase(
            sessionRepo,
            RegisterOrLoginPlayerUseCase(playerRepo),
            questionRepo
        )
    }

    class FakeQuizSessionRepository(
        private val failOnSave: Boolean = false,
        private val failOnGet: Boolean = false
    ) : QuizSessionRepository {
        var wasSaveCalled = false
        private val storage = mutableMapOf<String, QuizSession>()

        override suspend fun save(session: QuizSession): Result<Unit> {
            if (failOnSave) return Result.failure(Exception("DB Save Error"))
            storage[session.id.value] = session
            wasSaveCalled = true
            return Result.success(Unit)
        }

        override suspend fun getById(id: QuizSessionId): Result<QuizSession> {
            if (failOnGet) return Result.failure(Exception("DB Get Error"))
            return Result.success(storage[id.value] ?: return Result.failure(Exception("Not found")))
        }
    }

    class FakePlayerRepository(private val failOnSave: Boolean = false) : PlayerRepository {
        private val players = mutableListOf<Player>()
        override suspend fun save(player: Player): Result<Unit> {
            if (failOnSave) return Result.failure(Exception("DB Player Error"))
            players.add(player)
            return Result.success(Unit)
        }
        override suspend fun getByName(name: PlayerName): Result<Player?> = Result.success(players.find { it.name == name })
        override suspend fun getAll(): Result<List<Player>> = Result.success(players)
    }

    class GeneratorQuestionRepository(private val failOnGet: Boolean = false) : QuestionRepository {
        private var i = 0
        override suspend fun getRandomQuestion(): Result<Question> {
            if (failOnGet) return Result.failure(Exception("API Error"))
            i++
            return Question.create("q$i", "Q", listOf("A", "B", "C", "D", "E"))
        }
        override suspend fun checkAnswer(questionId: String, answer: String): Result<Boolean> = Result.success(true)
    }
}