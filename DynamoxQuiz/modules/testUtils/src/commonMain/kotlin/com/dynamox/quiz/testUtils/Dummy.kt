package com.dynamox.quiz.testUtils

import com.dynamox.quiz.database.User
import kotlin.time.Clock
import kotlin.uuid.Uuid

object Dummy {

    fun user(
        id: Uuid = Uuid.random(),
        email: String = "testuser@test.com",
        name: String = "Test User",
        passwordAlgo: String = "pbkdf2-hmac-sha256",
        passwordSalt: ByteArray = "salt".encodeToByteArray(),
        passwordHash: ByteArray = "hash".encodeToByteArray(),
        passwordIters: Long = 200_000,
        createdAt: Long = now(),
        lastModified: Long = now(),
        deleted: Boolean = false,
        deletedAt: Long? = null,
    ) = User(
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

    private fun now() = Clock.System.now().toEpochMilliseconds()
}