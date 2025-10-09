package com.dynamox.quiz.app.session

import com.dynamox.quiz.app.session.model.SessionState
import com.dynamox.quiz.auth.model.AuthenticateResult
import com.dynamox.quiz.auth.model.RegisterResult
import kotlinx.coroutines.flow.StateFlow

/**
 * Manages user session state, including registration, authentication, and logout.
 */
interface SessionManager {
    /**
     * A [StateFlow] representing the current session state.
     */
    val state: StateFlow<SessionState>

    /**
     * Registers a new user with the provided [email], [password], and [name].
     * Returns a [RegisterResult] indicating success or failure.
     */
    suspend fun register(email: String, password: CharArray, name: String): RegisterResult

    /**
     * Logs in a user with the provided [email] and [password].
     * Returns an [AuthenticateResult] indicating success or failure.
     */
    suspend fun login(email: String, password: CharArray): AuthenticateResult

    /**
     * Logs out the current user, transitioning the session state to unauthenticated.
     */
    fun logout()

    /**
     * Sets the session state to unauthenticated.
     */
    fun setRegistering()

    /**
     * Sets the session state to registering.
     */
    fun setAuthenticating()
}