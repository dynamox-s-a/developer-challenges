package com.dynamox.quiz.test.database

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import app.cash.sqldelight.db.SqlDriver
import com.dynamox.quiz.database.DriverFactory
import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.persistenceKoinModule
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.shared.systemEpochMilliseconds
import com.dynamox.quiz.testUtils.Dummy
import junit.framework.TestCase.assertTrue
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.runTest
import org.junit.Before
import org.junit.Test
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.test.AutoCloseKoinTest
import org.koin.test.inject
import kotlin.random.Random
import kotlin.test.assertEquals
import kotlin.time.Duration.Companion.minutes
import kotlin.uuid.Uuid

class ClientDataRepositoryImplTest : AutoCloseKoinTest() {
    private val repo: ClientDataRepository by inject()

    @Before
    fun setup() {
        startKoin {
            modules(
                module {
                    single<SqlDriver> {
                        val context = ApplicationProvider.getApplicationContext<Context>()
                        DriverFactory(context).createInMemoryDriver()
                    }
                },
                persistenceKoinModule()
            )
        }
    }

    @Test
    fun loadUserEntity_and_loadUser_returnsPersistedData() = runTest {
        val user = createAndSaveUser()

        val loadedEntity = repo.loadUserEntity(user.id).getOrThrow()
        assertEquals(user.id, loadedEntity.id)
        assertEquals(user.email, loadedEntity.email)

        val loadedModel = repo.loadUser(user.id).getOrThrow()
        assertEquals(user.id, loadedModel.id)
        assertEquals(user.name, loadedModel.name)
        assertEquals(user.email, loadedModel.email)
    }

    @Test
    fun createUserEntity_respectsUniqueConstraint() = runTest {
        val userLower = Dummy.user(email = "user@test.com")
        assertTrue(repo.createUserEntity(userLower).isSuccess)

        val userDuplicate = Dummy.user(email = "user@test.com")
        assertTrue(repo.createUserEntity(userDuplicate).isFailure)
    }

    @Test
    fun updateUserEntity_preservesScores_andUpdatesFields() = runTest {
        val user = createAndSaveUser()
        val score1 = createAndSaveScore(userId = user.id)
        val score2 = createAndSaveScore(userId = user.id)

        val beforeUpdateEntity = repo.loadUserEntity(user.id).getOrThrow()
        val updatedEntity = beforeUpdateEntity.copy(
            name = "New Name",
            lastModified = systemEpochMilliseconds(),
        )

        val result = repo.updateUserEntity(updatedEntity)
        assertTrue(result.isSuccess)

        val afterUpdateEntity = repo.loadUserEntity(user.id).getOrThrow()
        assertEquals(updatedEntity.name, afterUpdateEntity.name)
        assertEquals(beforeUpdateEntity.createdAt, afterUpdateEntity.createdAt)
        assertTrue(afterUpdateEntity.lastModified >= beforeUpdateEntity.lastModified)

        val remainingScores = repo.loadUserQuizScores(user.id).getOrThrow()
        assertEquals(2, remainingScores.size)
        assertTrue(remainingScores.any { it.id == score1.id })
        assertTrue(remainingScores.any { it.id == score2.id })
    }

    @Test
    fun updateUserEntity_failsWhenUpdatingToExistingEmail() = runTest {
        val user1 = createAndSaveUser()
        val user2 = createAndSaveUser()

        val secondUserUpdatedToDuplicateEmail = user2.copy(
            email = user1.email,
            lastModified = systemEpochMilliseconds()
        )
        val result = repo.updateUserEntity(secondUserUpdatedToDuplicateEmail)
        assertTrue(result.isFailure)
    }

    @Test
    fun deleteUser_marksAsDeleted_andRemovesFromUserBestScoreView() = runTest {
        val user = createAndSaveUser()
        createAndSaveScore(userId = user.id, score = 42, timeTaken = 1234)

        assertTrue(repo.deleteUser(user.id).isSuccess)

        val entityAfterDelete = repo.loadUserEntity(user.id).getOrThrow()
        assertTrue(entityAfterDelete.deleted)

        val rowsInView = repo.loadTopQuizScores().getOrThrow()
        assertTrue(rowsInView.isEmpty())
    }

    @Test
    fun emailIsAvailable_trueThenFalseAndStillFalseAfterSoftDelete() = runTest {
        val email = "test@test.com"
        assertTrue(repo.emailIsAvailable(email).getOrThrow())

        val user = createAndSaveUser(email = email)
        assertTrue(!repo.emailIsAvailable(email).getOrThrow())

        assertTrue(repo.deleteUser(user.id).isSuccess)
        assertTrue(!repo.emailIsAvailable(email).getOrThrow())
    }

    @Test
    fun saveQuizScore_and_loadQuizScore_roundTrip() = runTest {
        val user = createAndSaveUser()
        val score = createAndSaveScore(userId = user.id)

        val loadedScore = repo.loadQuizScore(score.id).getOrThrow()
        assertEquals(score, loadedScore)
    }

    @Test
    fun saveQuizScore_failsForUnknownUser_dueToForeignKey() = runTest {
        val result = repo.saveQuizScore(Dummy.score())
        assertTrue(result.isFailure)
    }

    @Test
    fun loadTopQuizScores_returnsBestPerUser() = runTest {
        val user1 = createAndSaveUser()
        val user2 = createAndSaveUser()

        createAndSaveScore(userId = user1.id, score = 90, timeTaken = 60)
        val user1BestScore = createAndSaveScore(userId = user1.id, score = 100, timeTaken = 50)

        createAndSaveScore(userId = user2.id, score = 80, timeTaken = 40)
        val user2BestScore = createAndSaveScore(userId = user2.id, score = 95, timeTaken = 40)

        val topScores = repo.loadTopQuizScores().getOrThrow()
        assertEquals(2, topScores.size)
        assertTrue(topScores.any { it.id == user1BestScore.id })
        assertTrue(topScores.any { it.id == user2BestScore.id })
    }

    @Test
    fun observeTopQuizScores_emitsUserBestScoreOnChanges() = runTest {
        val user = createAndSaveUser()

        val score1 = Dummy.score(userId = user.id, score = 10, timeTaken = 100)
        val score2 = Dummy.score(userId = user.id, score = 20, timeTaken = 200)
        val score3 = Dummy.score(userId = user.id, score = 20, timeTaken = 50)

        val job = launch {
            repo.observeTopQuizScores().collect { bestScores ->
                val bestScore = bestScores.firstOrNull()
                when (bestScore?.scoreId) {
                    score1.id -> assertEquals(score1.score, bestScore.score)
                    score2.id -> {
                        assertEquals(score2.score, bestScore.score)
                        assertEquals(score2.timeTakenMs, bestScore.timeTakenMs)
                    }
                    score3.id -> {
                        assertEquals(score3.score, bestScore.score)
                        assertEquals(score3.timeTakenMs, bestScore.timeTakenMs)
                        cancel()
                    }

                    else -> {
                        // do nothing, waiting for first insert
                    }
                }
            }
        }

        repo.saveQuizScore(score1).getOrThrow()
        repo.saveQuizScore(score2).getOrThrow()
        repo.saveQuizScore(score3).getOrThrow()

        job.join()
    }

    @Test
    fun loadUserQuizScores_appliesSortingAndLimit() = runTest {
        val user = createAndSaveUser()

        val now = systemEpochMilliseconds()
        val scoreOlder = createAndSaveScore(
            userId = user.id,
            score = 50,
            timeTaken = 200,
            createdAt = now - 3_000
        )
        val scoreMiddle = createAndSaveScore(
            userId = user.id,
            score = 60,
            timeTaken = 150,
            createdAt = now - 2_000
        )
        val scoreNewest = createAndSaveScore(
            userId = user.id,
            score = 70,
            timeTaken = 100,
            createdAt = now - 1_000
        )

        val userScores = repo.loadUserQuizScores(user.id).getOrThrow()
        assertEquals(userScores.map { it.id }, listOf(scoreNewest.id, scoreMiddle.id, scoreOlder.id))
    }

    @Test
    fun observeUserQuizScores_respectsLimit_andUpdatesOnInsert() = runTest {
        val user = createAndSaveUser()

        val now = systemEpochMilliseconds()
        val score1 =
            Dummy.score(userId = user.id, score = 10, timeTaken = 100, createdAt = now - 2_000)
        val score2 =
            Dummy.score(userId = user.id, score = 20, timeTaken = 100, createdAt = now - 1_000)
        val score3 = Dummy.score(userId = user.id, score = 30, timeTaken = 100, createdAt = now)

        val job = launch {
            repo.observeUserQuizScores(userId = user.id).collect { userScores ->
                when (userScores.size) {
                    0 -> {
                        // do nothing, waiting for first insert
                    }

                    1 -> assertEquals(score1.id, userScores.first().id)
                    2 -> {
                        val bestScore = userScores.first()
                        assertEquals(score2.id, bestScore.id)
                        assertEquals(score2.score, bestScore.score)
                    }

                    3 -> {
                        val bestScore = userScores.first()
                        assertEquals(score3.id, bestScore.id)
                        assertEquals(score3.score, bestScore.score)
                        cancel()
                    }

                    else -> cancel()
                }
            }
        }

        repo.saveQuizScore(score1).getOrThrow()
        repo.saveQuizScore(score2).getOrThrow()
        repo.saveQuizScore(score3).getOrThrow()

        job.join()
    }

    @Test
    fun deleteQuizScore_softDeletePromotesNextBestInView() = runTest {
        val user = createAndSaveUser()

        val score1 = createAndSaveScore(userId = user.id, score = 100, timeTaken = 10)
        val score2 = createAndSaveScore(userId = user.id, score = 90, timeTaken = 5)

        val bestScoreBefore = repo.loadUserBestScore(user.id).getOrThrow()
        assertEquals(score1.id, bestScoreBefore.scoreId)

        assertTrue(repo.deleteQuizScore(score1.id).isSuccess)

        val bestScoreAfter = repo.loadUserBestScore(user.id).getOrThrow()
        assertEquals(score2.id, bestScoreAfter.scoreId)
    }

    suspend fun createAndSaveUser(
        id: Uuid = Uuid.random(),
        email: String = "testuser_${id}@test.com",
        name: String = "Test User",
        deleted: Boolean = false,
        deletedAt: Long? = null,
    ): UserEntity {
        val user = Dummy.user(
            id = id,
            email = email,
            name = name,
            deleted = deleted,
            deletedAt = deletedAt,
        )
        repo.createUserEntity(user).getOrThrow()
        return user
    }

    suspend fun createAndSaveScore(
        id: Uuid = Uuid.random(),
        userId: Uuid = Uuid.random(),
        score: Int = Random.nextInt(11),
        timeTaken: Long = Random.nextInt(2, 6).minutes.inWholeMilliseconds,
        createdAt: Long = systemEpochMilliseconds(),
        deleted: Boolean = false,
        deletedAt: Long? = null
    ): QuizScore {
        val score = Dummy.score(
            id = id,
            userId = userId,
            score = score,
            timeTaken = timeTaken,
            createdAt = createdAt,
            deleted = deleted,
            deletedAt = deletedAt,
        )
        repo.saveQuizScore(score).getOrThrow()
        return score
    }
}