package com.dynamox.quiz.database.repository

import app.cash.sqldelight.coroutines.asFlow
import com.dynamox.quiz.database.DatabaseDynamoxQuiz
import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserBestScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.models.toModel
import com.dynamox.quiz.database.utils.runCatchingOnDispatcher
import com.dynamox.quiz.shared.systemEpochMilliseconds
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlin.uuid.Uuid

class ClientDataRepositoryImpl(
    private val database: DatabaseDynamoxQuiz,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : ClientDataRepository {
    val userQueries = database.userEntityQueries
    val scoresQueries = database.quizScoreQueries
    val bestScoresQueries = database.userBestScoreQueries

    override suspend fun loadUserEntity(id: Uuid) = runCatchingOnDispatcher(dispatcher) {
        userQueries.selectById(id).executeAsOne()
    }

    override suspend fun createUserEntity(user: UserEntity) = runCatchingOnDispatcher(dispatcher) {
        userQueries.insert(user.copy(email = user.email.lowercase()))
        Unit
    }

    override suspend fun updateUserEntity(user: UserEntity) = runCatchingOnDispatcher(dispatcher) {
        userQueries.update(
            id = user.id,
            email = user.email.lowercase(),
            name = user.name,
            createdAt = user.createdAt,
            lastModified = systemEpochMilliseconds(),
            deleted = user.deleted,
            deletedAt = user.deletedAt,
            password_algo = user.password_algo,
            password_salt = user.password_salt,
            password_hash = user.password_hash,
            password_iters = user.password_iters,
        )
        Unit
    }

    override suspend fun loadUser(id: Uuid) = runCatchingOnDispatcher(dispatcher) {
        userQueries.selectById(id).executeAsOne().toModel()
    }

    override suspend fun deleteUser(id: Uuid) = runCatchingOnDispatcher(dispatcher) {
        val user = loadUserEntity(id).getOrThrow()
        val now = systemEpochMilliseconds()
        userQueries.update(
            id = user.id,
            email = user.email,
            name = user.name,
            createdAt = user.createdAt,
            lastModified = now,
            deleted = true,
            deletedAt = now,
            password_algo = user.password_algo,
            password_salt = user.password_salt,
            password_hash = user.password_hash,
            password_iters = user.password_iters,
        )
        Unit
    }

    override suspend fun emailIsAvailable(email: String) = runCatchingOnDispatcher(dispatcher) {
        val rows = userQueries.selectByEmail(email.lowercase()).executeAsList()
        rows.isEmpty()
    }

    override suspend fun saveQuizScore(score: QuizScore) = runCatchingOnDispatcher(dispatcher) {
        scoresQueries.save(score)
        Unit
    }

    override suspend fun loadTopQuizScores() = runCatchingOnDispatcher(dispatcher) {
        val best = bestScoresQueries.selectAll().executeAsList()
        best.map { row -> scoresQueries.selectById(row.scoreId).executeAsOne() }
    }

    override suspend fun observeTopQuizScores(): Flow<List<UserBestScore>> {
        return bestScoresQueries
            .selectAll()
            .asFlow()
            .map { it.executeAsList() }
            .flowOn(dispatcher)
    }

    override suspend fun loadUserBestScore(userId: Uuid): Result<UserBestScore> =
        runCatchingOnDispatcher(dispatcher) {
            bestScoresQueries.selectByUserId(userId).executeAsOne()
        }

    override suspend fun loadUserQuizScores(userId: Uuid) =
        runCatchingOnDispatcher(dispatcher) {
            database.quizScoreQueries
                .selectAllByUserId(userId)
                .executeAsList()
                .sortedWith(
                    compareByDescending<QuizScore> { it.createdAt }
                        .thenBy { it.timeTakenMs }
                        .thenBy { it.id }
                )
        }

    override suspend fun observeUserQuizScores(userId: Uuid): Flow<List<QuizScore>> {
        return database.quizScoreQueries
            .selectAllByUserId(userId)
            .asFlow()
            .map { query ->
                query.executeAsList().sortedWith(
                    compareByDescending<QuizScore> { it.createdAt }
                        .thenBy { it.timeTakenMs }
                        .thenBy { it.id.toString() }
                )
            }
            .flowOn(dispatcher)
    }

    override suspend fun deleteQuizScore(id: Uuid) = runCatchingOnDispatcher(dispatcher) {
        val score = loadQuizScore(id).getOrThrow()
        scoresQueries.save(
            score.copy(
                deleted = true,
                deletedAt = systemEpochMilliseconds(),
            )
        )
        Unit
    }

    override suspend fun loadQuizScore(id: Uuid) = runCatchingOnDispatcher(dispatcher) {
        scoresQueries.selectById(id).executeAsOne()
    }
}