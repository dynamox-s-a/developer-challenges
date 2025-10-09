package com.dynamox.quiz.testUtils.database

import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserBestScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.model.toModel
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.shared.systemEpochMilliseconds
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlin.concurrent.Volatile
import kotlin.uuid.Uuid


/**
 * In-memory implementation of [ClientDataRepository] for testing purposes.
 * Supports simulating failures for specific operations.
 */
class InMemoryClientDataRepository : ClientDataRepository {

    enum class Op {
        LOAD_USER_ENTITY,
        CREATE_USER,
        UPDATE_USER_ENTITY,
        LOAD_USER_MODEL,
        DELETE_USER,
        EMAIL_IS_AVAILABLE,
        SAVE_QUIZ_SCORE,
        LOAD_TOP_QUIZ_SCORES,
        OBSERVE_TOP_QUIZ_SCORES,
        LOAD_USER_BEST_SCORE,
        LOAD_USER_QUIZ_SCORES,
        OBSERVE_USER_QUIZ_SCORES,
        DELETE_QUIZ_SCORE,
        LOAD_QUIZ_SCORE,
        LOAD_USER_BY_EMAIL,
        UPDATE_USER_PASSWORD
    }

    @Volatile
    private var shouldFailAll: Boolean = false

    private val failingOps = mutableSetOf<Op>()

    private val mutex = Mutex()

    private val users = LinkedHashMap<Uuid, UserEntity>()
    private val emailIndex = HashMap<String, Uuid>()

    private val scores = LinkedHashMap<Uuid, QuizScore>()

    private val bestScoresFlow = MutableStateFlow<List<UserBestScore>>(emptyList())
    private val userScoresFlows = HashMap<Uuid, MutableStateFlow<List<QuizScore>>>()

    override suspend fun loadUserEntity(id: Uuid) = mutex.withLock {
        if (shouldFail(Op.LOAD_USER_ENTITY)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_USER_ENTITY"))
        val entity =
            users[id] ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        Result.success(entity)
    }

    override suspend fun createUserEntity(user: UserEntity) = mutex.withLock {
        if (shouldFail(Op.CREATE_USER)) return@withLock Result.failure(RuntimeException("forced failure: CREATE_USER"))
        val normalizedEmail = user.email.lowercase()
        requireEmailAvailable(normalizedEmail)

        val now = systemEpochMilliseconds()
        val entity = user.copy(
            email = normalizedEmail,
            createdAt = user.createdAt.takeIf { it > 0 } ?: now,
            lastModified = user.lastModified.takeIf { it > 0 } ?: now
        )

        if (users.containsKey(entity.id)) {
            return@withLock Result.failure(IllegalStateException("User id already exists"))
        }

        users[entity.id] = entity
        emailIndex[normalizedEmail] = entity.id

        updateBestScoresFlowLocked()
        Result.success(Unit)
    }

    override suspend fun updateUserEntity(user: UserEntity) = mutex.withLock {
        if (shouldFail(Op.UPDATE_USER_ENTITY)) return@withLock Result.failure(RuntimeException("forced failure: UPDATE_USER_ENTITY"))
        val current = users[user.id]
            ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        val normalizedEmail = user.email.lowercase()

        if (normalizedEmail != current.email) {
            requireEmailAvailable(normalizedEmail, allowId = user.id)
            emailIndex.remove(current.email)
            emailIndex[normalizedEmail] = user.id
        }

        val updated = current.copy(
            email = normalizedEmail,
            name = user.name,
            password_algo = user.password_algo,
            password_salt = user.password_salt,
            password_hash = user.password_hash,
            password_iters = user.password_iters,
            createdAt = user.createdAt,
            lastModified = systemEpochMilliseconds(),
            deleted = user.deleted,
            deletedAt = user.deletedAt
        )

        users[user.id] = updated

        updateBestScoresFlowLocked()
        Result.success(Unit)
    }

    override suspend fun loadUser(id: Uuid) = mutex.withLock {
        if (shouldFail(Op.LOAD_USER_MODEL)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_USER_MODEL"))
        val user =
            users[id] ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        Result.success(user.toModel())
    }

    override suspend fun deleteUser(id: Uuid) = mutex.withLock {
        if (shouldFail(Op.DELETE_USER)) return@withLock Result.failure(RuntimeException("forced failure: DELETE_USER"))
        val existing =
            users[id] ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        val now = systemEpochMilliseconds()
        val updated = existing.copy(
            deleted = true,
            deletedAt = now,
            lastModified = now
        )
        users[id] = updated

        updateBestScoresFlowLocked()
        Result.success(Unit)
    }

    override suspend fun emailIsAvailable(email: String) = mutex.withLock {
        if (shouldFail(Op.EMAIL_IS_AVAILABLE)) return@withLock Result.failure(RuntimeException("forced failure: EMAIL_IS_AVAILABLE"))
        val normalized = email.lowercase()
        Result.success(!emailIndex.containsKey(normalized))
    }

    override suspend fun loadUserEntityByEmail(email: String) = mutex.withLock {
        if (shouldFail(Op.LOAD_USER_BY_EMAIL)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_USER_BY_EMAIL"))
        val normalized = email.lowercase()
        val id = emailIndex[normalized] ?: return@withLock Result.success(null)
        Result.success(users[id])
    }

    override suspend fun updateUserPassword(
        userId: Uuid,
        algo: String,
        salt: ByteArray,
        hash: ByteArray,
        iters: Long
    ) = mutex.withLock {
        if (shouldFail(Op.UPDATE_USER_PASSWORD)) return@withLock Result.failure(RuntimeException("forced failure: UPDATE_USER_PASSWORD"))
        val current = users[userId]
            ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        val updated = current.copy(
            password_algo = algo,
            password_salt = salt,
            password_hash = hash,
            password_iters = iters,
            lastModified = systemEpochMilliseconds()
        )
        users[userId] = updated
        Result.success(Unit)
    }

    override suspend fun saveQuizScore(score: QuizScore) = mutex.withLock {
        if (shouldFail(Op.SAVE_QUIZ_SCORE)) return@withLock Result.failure(RuntimeException("forced failure: SAVE_QUIZ_SCORE"))
        if (users[score.userId] == null) return@withLock Result.failure(IllegalStateException("Unknown userId"))
        scores[score.id] = score

        updateUserScoresFlowLocked(score.userId)
        updateBestScoresFlowLocked()
        Result.success(Unit)
    }

    override suspend fun loadQuizScore(id: Uuid) = mutex.withLock {
        if (shouldFail(Op.LOAD_QUIZ_SCORE)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_QUIZ_SCORE"))
        val score =
            scores[id] ?: return@withLock Result.failure(NoSuchElementException("Score not found"))
        Result.success(score)
    }

    override suspend fun deleteQuizScore(id: Uuid) = mutex.withLock {
        if (shouldFail(Op.DELETE_QUIZ_SCORE)) return@withLock Result.failure(RuntimeException("forced failure: DELETE_QUIZ_SCORE"))
        val existing =
            scores[id] ?: return@withLock Result.failure(NoSuchElementException("Score not found"))
        val updated = existing.copy(
            deleted = true,
            deletedAt = systemEpochMilliseconds()
        )
        scores[id] = updated

        updateUserScoresFlowLocked(updated.userId)
        updateBestScoresFlowLocked()
        Result.success(Unit)
    }

    override suspend fun loadUserQuizScores(userId: Uuid) = mutex.withLock {
        if (shouldFail(Op.LOAD_USER_QUIZ_SCORES)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_USER_QUIZ_SCORES"))
        Result.success(sortedUserScoresVisible(userId))
    }

    override fun observeUserQuizScores(userId: Uuid): Flow<List<QuizScore>> {
        return flow {
            mutex.withLock {
                while (true) {
                    if (shouldFail(Op.OBSERVE_USER_QUIZ_SCORES)) {
                        emit(emptyList())
                    } else {
                        val flow = userScoresFlows.getOrPut(userId) { MutableStateFlow(sortedUserScoresVisible(userId)) }
                        emit(flow.value)
                    }
                    delay(100)
                }
            }
        }
    }


    override suspend fun loadTopQuizScores() = mutex.withLock {
        if (shouldFail(Op.LOAD_TOP_QUIZ_SCORES)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_TOP_QUIZ_SCORES"))
        val bestRows = computeTopBestAllUsers()
        val list = bestRows.mapNotNull { row -> scores[row.scoreId] }
        Result.success(list)
    }

    override fun observeTopQuizScores(): Flow<List<UserBestScore>> {
        return flow {
            mutex.withLock {
                while (true) {
                    if (shouldFail(Op.OBSERVE_TOP_QUIZ_SCORES)) {
                        emit(emptyList())
                    } else {
                        if (bestScoresFlow.value.isEmpty()) {
                            val bestScores = computeTopBestAllUsers()
                            bestScoresFlow.update { bestScores }
                        }
                        emit(bestScoresFlow.value)
                    }
                    delay(100)
                }
            }
        }
    }

    override suspend fun loadUserBestScore(userId: Uuid) = mutex.withLock {
        if (shouldFail(Op.LOAD_USER_BEST_SCORE)) return@withLock Result.failure(RuntimeException("forced failure: LOAD_USER_BEST_SCORE"))
        val user = users[userId]
            ?: return@withLock Result.failure(NoSuchElementException("User not found"))
        val best = computeBestForUser(user)
            ?: return@withLock Result.failure(NoSuchElementException("No best score for user"))
        Result.success(best)
    }

    private fun requireEmailAvailable(emailLower: String, allowId: Uuid? = null) {
        val existing = emailIndex[emailLower]
        if (existing != null && existing != allowId) {
            throw IllegalStateException("E-mail already registered")
        }
    }

    private fun updateBestScoresFlowLocked() {
        val bestScores = computeTopBestAllUsers()
        bestScoresFlow.update { bestScores }
    }

    private fun computeTopBestAllUsers(): List<UserBestScore> {
        val bestRows = users.values
            .mapNotNull { computeBestForUser(it) }
            .sortedWith(
                compareByDescending<UserBestScore> { it.score }
                    .thenBy { it.timeTakenMs }
                    .thenBy { it.createdAt }
                    .thenBy { it.userName }
            )
            .toList()
        return bestRows
    }

    private fun computeBestForUser(user: UserEntity): UserBestScore? {
        if (user.deleted) return null
        val best = scores.values
            .filter { it.userId == user.id && !it.deleted }
            .maxWithOrNull(
                compareBy<QuizScore> { it.score }
                    .thenBy { it.timeTakenMs }
                    .thenBy { it.createdAt }
                    .thenBy { it.id }
                    .reversed()
            )
            ?: return null
        return UserBestScore(
            userId = user.id,
            userName = user.name,
            scoreId = best.id,
            score = best.score,
            timeTakenMs = best.timeTakenMs,
            createdAt = best.createdAt
        )
    }

    private fun updateUserScoresFlowLocked(userId: Uuid) {
        val flow = userScoresFlows.getOrPut(userId) { MutableStateFlow(emptyList()) }
        val userScores = sortedUserScoresVisible(userId)
        flow.update { userScores }
    }

    private fun sortedUserScoresVisible(userId: Uuid): List<QuizScore> {
        return scores.values
            .filter { it.userId == userId && !it.deleted }
            .sortedWith(
                compareByDescending<QuizScore> { it.createdAt }
                    .thenBy { it.timeTakenMs }
                    .thenBy { it.id }
            )
            .toList()
    }

    fun setShouldFailAll(enabled: Boolean) {
        shouldFailAll = enabled
    }

    fun setShouldFail(vararg ops: Op, enabled: Boolean = true) {
        if (enabled) failingOps.addAll(ops.toList())
        else ops.forEach { failingOps.remove(it) }
    }

    fun clearFailures() {
        shouldFailAll = false
        failingOps.clear()
    }

    private fun shouldFail(op: Op): Boolean = shouldFailAll || failingOps.contains(op)
}
