package com.dynamox.quiz.auth

import com.dynamox.quiz.auth.models.AuthenticateResult
import com.dynamox.quiz.auth.models.ChangePasswordResult
import com.dynamox.quiz.auth.models.RegisterResult
import kotlin.uuid.Uuid

interface Authenticator {
    suspend fun register(
        name: String,
        email: String,
        password: CharArray
    ): RegisterResult

    suspend fun authenticate(
        email: String,
        password: CharArray
    ): AuthenticateResult

    suspend fun changePassword(
        userId: Uuid,
        currentPassword: CharArray,
        newPassword: CharArray
    ): ChangePasswordResult
}