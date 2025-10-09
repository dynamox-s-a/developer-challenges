package com.dynamox.quiz.auth.impl

import com.dynamox.quiz.auth.Authenticator
import com.dynamox.quiz.auth.kdf.PasswordKdf
import com.dynamox.quiz.auth.model.AuthenticateResult
import com.dynamox.quiz.auth.model.ChangePasswordResult
import com.dynamox.quiz.auth.model.RegisterResult
import com.dynamox.quiz.auth.util.constantTimeEquals
import com.dynamox.quiz.auth.util.wipe
import com.dynamox.quiz.database.UserEntity
import com.dynamox.quiz.database.model.toModel
import com.dynamox.quiz.database.repository.ClientDataRepository
import com.dynamox.quiz.shared.systemEpochMilliseconds
import kotlin.uuid.Uuid

class AuthenticatorImpl(
    private val repository: ClientDataRepository,
    private val kdf: PasswordKdf,
) : Authenticator {
    override suspend fun register(
        name: String,
        email: String,
        password: CharArray
    ): RegisterResult {
        suspend fun executeRegister(): RegisterResult {
            val emailLower = email.trim().lowercase()
            val emailIsAvailable = repository.emailIsAvailable(emailLower).getOrNull()
                ?: return RegisterResult.FailedToVerifyEmail
            if (!emailIsAvailable) {
                return RegisterResult.EmailAlreadyInUse
            }

            val salt = kdf.generateSalt(16)
            val hash = kdf.derive(password, salt)

            val now = systemEpochMilliseconds()
            val entity = UserEntity(
                id = Uuid.Companion.random(),
                email = emailLower,
                name = name,
                password_algo = kdf.algorithmName,
                password_salt = salt,
                password_hash = hash,
                password_iters = kdf.iterations.toLong(),
                createdAt = now,
                lastModified = now,
                deleted = false,
                deletedAt = null
            )

            repository.createUserEntity(entity).onFailure {
                return RegisterResult.FailedToCreateUser
            }

            return RegisterResult.Success(entity.toModel())
        }

        val result = executeRegister()
        wipe(password)
        return result
    }

    override suspend fun authenticate(
        email: String,
        password: CharArray
    ): AuthenticateResult {
        suspend fun executeAuthenticate(): AuthenticateResult {
            val emailLower = email.trim().lowercase()

            val entity = repository.loadUserEntityByEmail(emailLower)
                .onFailure {
                    return AuthenticateResult.FailedToLoadUser
                }.getOrNull()
            if (entity == null) return AuthenticateResult.InvalidCredentials
            if (entity.deleted) return AuthenticateResult.UserDeleted

            val hash = kdf.derive(password, entity.password_salt)
            if (!constantTimeEquals(
                    hash,
                    entity.password_hash
                )
            ) return AuthenticateResult.InvalidCredentials

            val needsRehash = entity.password_algo != kdf.algorithmName ||
                    entity.password_iters.toInt() < kdf.iterations ||
                    entity.password_hash.size != kdf.derivedKeyLengthBytes

            if (needsRehash) {
                val newSalt = kdf.generateSalt(16)
                val newHash = kdf.derive(password, newSalt)
                repository.updateUserPassword(
                    userId = entity.id,
                    algo = kdf.algorithmName,
                    salt = newSalt,
                    hash = newHash,
                    iters = kdf.iterations.toLong()
                ).onFailure {
                    return AuthenticateResult.FailedToUpdateCredentials
                }
            }

            return AuthenticateResult.Success(entity.toModel())
        }

        val result = executeAuthenticate()
        wipe(password)
        return result
    }

    override suspend fun changePassword(
        userId: Uuid,
        currentPassword: CharArray,
        newPassword: CharArray
    ): ChangePasswordResult {
        suspend fun executeChangePassword(): ChangePasswordResult {
            val entity = repository.loadUserEntity(userId).onFailure {
                return ChangePasswordResult.FailedToLoadUser
            }.getOrNull()
            if (entity == null) return ChangePasswordResult.InvalidCredentials
            if (entity.deleted) return ChangePasswordResult.UserDeleted

            val currentHash = kdf.derive(currentPassword, entity.password_salt)
            if (!constantTimeEquals(
                    currentHash,
                    entity.password_hash
                )
            ) return ChangePasswordResult.InvalidCredentials

            val newSalt = kdf.generateSalt(16)
            val newHash = kdf.derive(newPassword, newSalt)

            repository.updateUserPassword(
                userId = userId,
                algo = kdf.algorithmName,
                salt = newSalt,
                hash = newHash,
                iters = kdf.iterations.toLong()
            ).onFailure {
                return ChangePasswordResult.FailedToUpdateCredentials
            }
            return ChangePasswordResult.Success
        }

        val result = executeChangePassword()
        wipe(currentPassword)
        wipe(newPassword)
        return result
    }
}