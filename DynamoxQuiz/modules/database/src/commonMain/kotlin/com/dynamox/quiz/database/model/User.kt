package com.dynamox.quiz.database.model

import com.dynamox.quiz.database.UserEntity
import kotlin.uuid.Uuid

data class User(
    val id: Uuid,
    val name: String,
    val email: String,
)

fun UserEntity.toModel(): User = User(
    id = id,
    name = name,
    email = email,
)

fun User.toEntity(
    passwordAlgo: String,
    passwordSalt : ByteArray,
    passwordHash: ByteArray,
    passwordIters: Long,
    createdAt: Long,
    lastModified: Long,
    deleted: Boolean,
    deletedAt: Long?,
): UserEntity = UserEntity(
    id = id,
    name = name,
    email = email,
    password_algo = passwordAlgo,
    password_salt = passwordSalt,
    password_hash = passwordHash,
    password_iters = passwordIters,
    createdAt = createdAt,
    lastModified = lastModified,
    deleted = deleted,
    deletedAt = deletedAt,
)