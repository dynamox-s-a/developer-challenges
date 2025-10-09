package com.dynamox.quiz.auth

import com.dynamox.quiz.auth.model.AuthenticateResult
import com.dynamox.quiz.auth.model.ChangePasswordResult
import com.dynamox.quiz.auth.model.RegisterResult
import kotlin.uuid.Uuid

/**
 * Interface for user authentication and registration.
 */
interface Authenticator {
    /**
     * Registers a new user with the provided details.
     *
     * @param name The name of the user.
     * @param email The email address of the user.
     * @param password The password for the user account.
     * @return A [RegisterResult] indicating success or failure of the registration.
     */
    suspend fun register(
        name: String,
        email: String,
        password: CharArray
    ): RegisterResult

    /**
     * Authenticates a user with the provided email and password.
     *
     * @param email The email address of the user.
     * @param password The password for the user account.
     * @return An [AuthenticateResult] indicating success or failure of the authentication.
     */
    suspend fun authenticate(
        email: String,
        password: CharArray
    ): AuthenticateResult

    /**
     * Changes the password for the user with the given ID.
     *
     * @param userId The ID of the user whose password is to be changed.
     * @param currentPassword The current password of the user.
     * @param newPassword The new password to set for the user.
     * @return A [ChangePasswordResult] indicating success or failure of the password change.
     */
    suspend fun changePassword(
        userId: Uuid,
        currentPassword: CharArray,
        newPassword: CharArray
    ): ChangePasswordResult
}