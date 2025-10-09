package com.dynamox.quiz.testUtils

import com.dynamox.quiz.database.QuizScore
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.shared.systemEpochMilliseconds
import kotlin.random.Random
import kotlin.time.Duration.Companion.minutes
import kotlin.uuid.Uuid

/**
 * Utility object to create dummy data for testing purposes.
 */
object Dummy {
    fun user(
        id: Uuid = Uuid.random(),
        email: String = "testuser_${id}@test.com",
        name: String = "Test User",
        passwordAlgo: String = "pbkdf2-hmac-sha256",
        passwordSalt: ByteArray = "salt".encodeToByteArray(),
        passwordHash: ByteArray = "hash".encodeToByteArray(),
        passwordIters: Long = 200_000,
        createdAt: Long = systemEpochMilliseconds(),
        lastModified: Long = systemEpochMilliseconds(),
        deleted: Boolean = false,
        deletedAt: Long? = null,
    ) = UserEntity(
        id = id,
        email = email,
        name = name,
        password_algo = passwordAlgo,
        password_salt = passwordSalt,
        password_hash = passwordHash,
        password_iters = passwordIters,
        createdAt = createdAt,
        lastModified = lastModified,
        deleted = deleted,
        deletedAt = deletedAt
    )

    fun score(
        id: Uuid = Uuid.random(),
        userId: Uuid = Uuid.random(),
        score: Int = Random.nextInt(11),
        timeTaken: Long = Random.nextInt(2, 6).minutes.inWholeMilliseconds,
        createdAt: Long = systemEpochMilliseconds(),
        deleted: Boolean = false,
        deletedAt: Long? = null
    ) = QuizScore(
        id = id,
        userId = userId,
        score = score,
        timeTakenMs = timeTaken,
        createdAt = createdAt,
        deleted = deleted,
        deletedAt = deletedAt
    )
}